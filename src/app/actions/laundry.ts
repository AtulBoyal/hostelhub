'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bookMachine(machineId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book a machine.' }
  }

  // Double check if the machine is still available
  const { data: machine, error: fetchError } = await supabase
    .from('washing_machines')
    .select('status')
    .eq('id', machineId)
    .single()

  if (fetchError || !machine) {
    return { error: 'Failed to verify machine status.' }
  }

  if (machine.status !== 'available') {
    return { error: 'Machine is no longer available.' }
  }

  // Calculate times
  const startTime = new Date()
  const expectedFinishTime = new Date(startTime.getTime() + 45 * 60000) // 45 minutes

  const { error: updateError } = await supabase
    .from('washing_machines')
    .update({
      status: 'running',
      started_by: user.id,
      start_time: startTime.toISOString(),
      expected_finish_time: expectedFinishTime.toISOString()
    })
    .eq('id', machineId)

  if (updateError) {
    return { error: 'Failed to book the machine.' }
  }

  revalidatePath('/laundry')
  revalidatePath('/dashboard')
  
  return { success: 'Machine booked successfully!' }
}
