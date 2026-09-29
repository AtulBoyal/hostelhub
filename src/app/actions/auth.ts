'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Invalid email or password' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const hostel_id = formData.get('hostel_id') as string
  const floor_id = formData.get('floor_id') as string
  const room_number = formData.get('room_number') as string

  if (!email || !password || !name || !hostel_id || !floor_id || !room_number) {
    return { error: 'All fields are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()

  // 1. Sign up the user (pass data in metadata for fallback)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        hostel_id,
        floor_id,
        room_number
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  const user = authData.user
  if (!user) {
    return { error: 'Failed to create user account' }
  }

  // If email confirmation is required and we don't have a session yet,
  // we cannot create the profile here (it would be an anonymous insert and likely fail RLS).
  if (!authData.session) {
    return { success: 'Account created! Please check your email to confirm and log in.' }
  }

  // 2. Insert into profiles table
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: user.id,
      name,
      email,
      hostel_id,
      floor_id,
      room_number,
      contribution_points: 0,
    },
  ])

  if (profileError) {
    console.error('Supabase profile insert error:', profileError)
    // If it fails, they will be redirected to dashboard, which redirects to onboarding
    // where they can try again. We won't block the UI with an error if the auth succeeded.
    redirect('/onboarding')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const supabase = await createClient()
  const origin = (await headers()).get('origin') || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    return { error: 'Could not reset password. Please try again later.' }
  }

  return { success: 'If an account exists for this email, we\'ve sent a password reset link.' }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!password || !confirmPassword) {
    return { error: 'Both fields are required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: 'Failed to update password. Your reset link may have expired.' }
  }

  return { success: 'Password updated successfully' }
}



export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
