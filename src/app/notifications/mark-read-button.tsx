'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { markAllNotificationsAsRead } from '@/app/actions/notifications'
import { CheckCheck } from 'lucide-react'

export function MarkReadButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="outline" 
      disabled={isPending}
      className="rounded-xl font-semibold border-slate-200 text-slate-700 bg-white shadow-sm hover:bg-slate-50 transition-colors px-4 h-10 w-full sm:w-auto"
      onClick={() => {
        startTransition(async () => {
          await markAllNotificationsAsRead()
        })
      }}
    >
      <CheckCheck className="h-4 w-4 mr-2 text-slate-500" />
      {isPending ? 'Marking...' : 'Mark all as read'}
    </Button>
  )
}
