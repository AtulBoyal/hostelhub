'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNeedHavePost(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to post.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as string
  const category = formData.get('category') as string

  if (!title || !type || !category) {
    return { error: 'Please fill out all required fields.' }
  }

  const { error } = await supabase
    .from('need_have_posts')
    .insert({
      user_id: user.id,
      title,
      description,
      type,
      category,
      status: 'active'
    })

  if (error) {
    console.error("Error inserting need_have post:", error)
    return { error: 'Failed to create post. ' + error.message }
  }

  revalidatePath('/need-have')
  revalidatePath('/dashboard')
  
  return { success: 'Post created successfully!' }
}
