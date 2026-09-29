'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMaintenanceIssue(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to report an issue.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('hostel_id, floor_id')
    .eq('id', user.id)
    .single()

  if (!profile?.hostel_id) {
    return { error: 'User profile not complete.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string || 'low'

  if (!title || !description || !category) {
    return { error: 'Please fill out all required fields.' }
  }

  const { error } = await supabase
    .from('maintenance_issues')
    .insert({
      reported_by: user.id,
      hostel_id: profile.hostel_id,
      floor_id: profile.floor_id,
      title,
      description,
      category,
      priority,
      status: 'reported'
    })

  if (error) {
    console.error("Error inserting issue:", error)
    return { error: 'Failed to report the issue. ' + error.message }
  }

  revalidatePath('/maintenance')
  revalidatePath('/dashboard')
  
  return { success: 'Issue reported successfully!' }
}
