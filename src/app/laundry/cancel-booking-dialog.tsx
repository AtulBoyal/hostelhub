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
import { AlertTriangle } from 'lucide-react'

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
      <DialogTrigger render={
        <Button variant="outline" className="w-full bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 rounded-lg transition-colors">
          Cancel Booking
        </Button>
      } />
      <DialogContent className="sm:max-w-[400px] rounded-3xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            Cancel Booking
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2 text-sm text-slate-600 font-medium">
          <p>Are you sure you want to cancel this booking?</p>
          <p className="mt-2 text-slate-500">The machine will immediately become available for other students.</p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <DialogClose render={<Button variant="outline" className="rounded-xl flex-1 sm:flex-none font-semibold">Back</Button>} />
          <Button variant="destructive" onClick={handleCancel} disabled={isPending} className="rounded-xl flex-1 sm:flex-none font-semibold">
            {isPending ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
