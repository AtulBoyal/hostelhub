'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { bookMachine } from '@/app/actions/laundry'

interface Props {
  machineId: string
  floorNumber: number
}

export function BookMachineDialog({ machineId, floorNumber }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const duration = parseInt(formData.get('duration') as string, 10)
    const instruction = formData.get('instruction') as string
    
    startTransition(async () => {
      const result = await bookMachine(machineId, duration, instruction)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Book Machine</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Floor {floorNumber} Machine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Machine:</span>
            <span className="col-span-2">Washing Machine 1</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Location:</span>
            <span className="col-span-2">Ramanujan Hostel &middot; Floor {floorNumber}</span>
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold">How long will you use it?</label>
            <Select name="duration" defaultValue="30" required>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Optional note</label>
            <Input name="instruction" placeholder="Example: Washing bedsheets" maxLength={100} />
          </div>
          
          {error && <div className="text-red-500 font-medium mt-2">{error}</div>}
          
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Booking...' : 'Book Machine'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

