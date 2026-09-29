'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { markAllNotificationsAsRead } from '@/app/actions/notifications'

export function MarkReadButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="outline" 
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await markAllNotificationsAsRead()
        })
      }}
    >
      {isPending ? 'Marking...' : 'Mark all as read'}
    </Button>
  )
}
