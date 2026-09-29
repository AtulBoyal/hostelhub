'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { cancelBooking } from '@/app/actions/laundry'

interface Props {
  machineId: string
}

export function CancelBookingDialog({ machineId }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleCancel = () => {
    setError(null)
    startTransition(async () => {
      const result = await cancelBooking(machineId)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm">Cancel Booking</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel your laundry booking?</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-slate-700">
          Are you sure you want to cancel this booking? The machine will immediately become available for others.
          {error && <div className="text-red-500 font-medium mt-4">{error}</div>}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Back</Button>} />
          <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
            {isPending ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
