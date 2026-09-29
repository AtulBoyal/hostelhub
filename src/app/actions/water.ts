'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function ensurePurifiers(hostelId: string) {
  const supabase = await createClient()

  // Fetch all floors for this hostel
  const { data: floors } = await supabase
    .from('floors')
    .select('id, floor_number')
    .eq('hostel_id', hostelId)
    .order('floor_number')

  if (!floors || floors.length === 0) return

  const floorIds = floors.map(f => f.id)
  
  // Fetch existing purifiers for these floors
  const { data: existingPurifiers } = await supabase
    .from('purifiers')
    .select('id, floor_id')
    .in('floor_id', floorIds)

  // Ensure exactly one purifier per floor
  const purifiersPerFloor = new Map<string, any[]>()
  for (const f of floors) purifiersPerFloor.set(f.id, [])
  if (existingPurifiers) {
    for (const p of existingPurifiers) {
      if (purifiersPerFloor.has(p.floor_id)) {
        purifiersPerFloor.get(p.floor_id)!.push(p)
      }
    }
  }

  let needsFixing = false
  for (const [floorId, purifiers] of purifiersPerFloor.entries()) {
    if (purifiers.length !== 1) {
      needsFixing = true
      break
    }
  }

  if (needsFixing) {
    // Delete all purifiers for these floors to reset
    await supabase.from('purifiers').delete().in('floor_id', floorIds)

    // Insert exactly one purifier per floor
    const newPurifiers = floors.map(f => ({
      floor_id: f.id,
      status: 'working'
    }))

    await supabase.from('purifiers').insert(newPurifiers)
  }
}

export async function reportPurifierProblem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to report a problem.' }
  }

  const purifierId = formData.get('purifierId') as string
  const problem = formData.get('problem') as string
  const description = formData.get('description') as string
  const floorId = formData.get('floorId') as string
  const hostelId = formData.get('hostelId') as string
  const floorNumber = formData.get('floorNumber') as string

  if (!purifierId || !problem || !description) {
    return { error: 'Missing required fields.' }
  }

  const title = `Water purifier problem - Floor ${floorNumber}`
  const fullDescription = `Problem: ${problem}\n\nDetails: ${description}`

  // Create maintenance issue
  const { error: issueError } = await supabase
    .from('maintenance_issues')
    .insert({
      reported_by: user.id,
      hostel_id: hostelId,
      floor_id: floorId,
      title,
      description: fullDescription,
      category: 'plumbing', // Using plumbing as it's an existing valid category for water issues
      status: 'reported',
      priority: 'high' // Water is essential
    })

  if (issueError) {
    return { error: 'Failed to create maintenance issue.' }
  }

  // Update purifier status
  const { error: updateError } = await supabase
    .from('purifiers')
    .update({
      status: 'not_working',
      complaint: problem
    })
    .eq('id', purifierId)

  if (updateError) {
    return { error: 'Failed to update purifier status.' }
  }

  revalidatePath('/water')
  return { success: 'Problem reported successfully.' }
}
