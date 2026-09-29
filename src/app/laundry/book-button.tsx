'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { bookMachine } from '@/app/actions/laundry'

export function BookButton({ machineId }: { machineId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      size="sm" 
      variant="outline" 
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await bookMachine(machineId)
          if (result?.error) {
            alert(result.error)
          }
        })
      }}
    >
      {isPending ? 'Booking...' : 'Book'}
    </Button>
  )
}
