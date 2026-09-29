'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitOnboarding(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const hostel_id = formData.get('hostel_id') as string
  const floor_id = formData.get('floor_id') as string
  const room_number = formData.get('room_number') as string

  if (!name || !hostel_id || !floor_id || !room_number) {
    return { error: 'All fields are required' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to complete onboarding.' }
  }

  // Insert into profiles table
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: user.id,
      name,
      email: user.email,
      hostel_id,
      floor_id,
      room_number,
      contribution_points: 0,
    },
  ])

  if (profileError) {
    return { error: 'Failed to create profile. Please try again or contact support.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
