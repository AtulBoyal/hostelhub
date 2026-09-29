'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bookMachine(machineId: string, durationMinutes: number = 30, instruction?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book a machine.' }
  }

  // Get current machine status
  const { data: machine, error: fetchError } = await supabase
    .from('washing_machines')
    .select('status, expected_finish_time')
    .eq('id', machineId)
    .single()

  if (fetchError || !machine) {
    return { error: 'Failed to verify machine status.' }
  }

  const now = new Date()
  const isAvailable = machine.status === 'available' || (machine.expected_finish_time && new Date(machine.expected_finish_time) < now)

  if (!isAvailable && machine.status !== 'available') {
    return { error: 'This machine was just booked by someone else.' }
  }

  // Calculate times
  const startTime = new Date()
  const expectedFinishTime = new Date(startTime.getTime() + durationMinutes * 60000)

  const { data: updateData, error: updateError } = await supabase
    .from('washing_machines')
    .update({
      status: 'running',
      started_by: user.id,
      start_time: startTime.toISOString(),
      expected_finish_time: expectedFinishTime.toISOString(),
      instruction: instruction || null
    })
    .eq('id', machineId)
    .in('status', ['available', 'running'])
    .select()

  if (updateError || !updateData || updateData.length === 0) {
    return { error: 'This machine was just booked by someone else.' }
  }

  revalidatePath('/laundry')
  
  return { success: 'Machine booked successfully.' }
}

export async function cancelBooking(machineId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in.' }
  }

  const { data: machine, error: fetchError } = await supabase
    .from('washing_machines')
    .select('started_by')
    .eq('id', machineId)
    .single()

  if (fetchError || !machine || machine.started_by !== user.id) {
    return { error: 'You can only cancel your own booking.' }
  }

  const { error: updateError } = await supabase
    .from('washing_machines')
    .update({
      status: 'available',
      started_by: null,
      start_time: null,
      expected_finish_time: null,
      instruction: null
    })
    .eq('id', machineId)
    .eq('started_by', user.id)

  if (updateError) {
    return { error: 'Failed to cancel booking.' }
  }

  revalidatePath('/laundry')
  return { success: 'Booking cancelled.' }
}

export async function reportMachineProblem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to report a problem.' }
  }

  const machineId = formData.get('machineId') as string
  const problem = formData.get('problem') as string
  const description = formData.get('description') as string
  const floorId = formData.get('floorId') as string
  const hostelId = formData.get('hostelId') as string
  const floorName = formData.get('floorName') as string

  if (!machineId || !problem || !description) {
    return { error: 'Missing required fields.' }
  }

  const title = `Washing machine problem - Floor ${floorName}`
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
      category: 'other',
      status: 'reported',
      priority: 'medium'
    })

  if (issueError) {
    return { error: 'Failed to create maintenance issue.' }
  }

  // Update machine status
  const { error: updateError } = await supabase
    .from('washing_machines')
    .update({
      status: 'out_of_service'
    })
    .eq('id', machineId)

  if (updateError) {
    return { error: 'Failed to update machine status.' }
  }

  revalidatePath('/laundry')
  return { success: 'Problem reported successfully.' }
}

export async function ensureWashingMachines(hostelId: string) {
  const supabase = await createClient()

  // Fetch all floors for this hostel
  const { data: floors } = await supabase
    .from('floors')
    .select('id, floor_number')
    .eq('hostel_id', hostelId)
    .order('floor_number')

  if (!floors || floors.length === 0) return

  // Fetch all existing machines for these floors
  const floorIds = floors.map(f => f.id)
  const { data: existingMachines } = await supabase
    .from('washing_machines')
    .select('id, floor_id')
    .in('floor_id', floorIds)

  // We want EXACTLY one machine per floor.
  const machinesPerFloor = new Map<string, any[]>()
  for (const f of floors) machinesPerFloor.set(f.id, [])
  if (existingMachines) {
    for (const m of existingMachines) {
      if (machinesPerFloor.has(m.floor_id)) {
        machinesPerFloor.get(m.floor_id)!.push(m)
      }
    }
  }

  let needsFixing = false
  for (const [floorId, machines] of machinesPerFloor.entries()) {
    if (machines.length !== 1) {
      needsFixing = true
      break
    }
  }

  if (needsFixing) {
    // Delete all machines for these floors to reset
    await supabase.from('washing_machines').delete().in('floor_id', floorIds)

    // Insert exactly one machine per floor
    const newMachines = floors.map(f => ({
      floor_id: f.id,
      machine_number: `Washing Machine 1`,
      status: 'available'
    }))

    await supabase.from('washing_machines').insert(newMachines)
  }
}
