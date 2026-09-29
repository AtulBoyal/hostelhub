'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reportLostFoundItem(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to report an item.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const location = formData.get('location') as string

  if (!title || !description || !type || !location) {
    return { error: 'Please fill out all required fields.' }
  }

  const { error } = await supabase
    .from('lost_found_items')
    .insert({
      user_id: user.id,
      title,
      description,
      type,
      location,
      status: 'active'
    })

  if (error) {
    console.error("Error inserting lost_found item:", error)
    return { error: 'Failed to report item. ' + error.message }
  }

  revalidatePath('/lost-found')
  revalidatePath('/dashboard')
  
  return { success: 'Item reported successfully!' }
}
