'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCommunityPost(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to post.' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string

  if (!title || !content || !category) {
    return { error: 'Please fill out all required fields.' }
  }

  const { error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user.id,
      title,
      content,
      category
    })

  if (error) {
    console.error("Error inserting community post:", error)
    return { error: 'Failed to create post. ' + error.message }
  }

  revalidatePath('/community')
  revalidatePath('/dashboard')
  
  return { success: 'Post created successfully!' }
}
