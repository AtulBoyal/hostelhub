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
import { WashingMachine } from 'lucide-react'

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
      <DialogTrigger render={
        <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-lg transition-colors">
          Book Machine
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
              <WashingMachine className="h-5 w-5 text-blue-600" />
            </div>
            Book Machine
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-900">Machine</span>
              <span>Washing Machine 1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Floor</span>
              <span>{floorNumber}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Duration</label>
            <Select name="duration" defaultValue="30" required>
              <SelectTrigger className="rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Optional note</label>
            <Input name="instruction" placeholder="e.g. Washing bedsheets" maxLength={100} className="rounded-xl border-slate-200" />
            <p className="text-[11px] text-slate-500">Other students will see this note.</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
          
          <DialogFooter className="mt-2 pt-4 border-t border-slate-100 flex gap-2 sm:justify-end">
            <DialogClose render={<Button type="button" variant="outline" className="rounded-xl flex-1 sm:flex-none">Cancel</Button>} />
            <Button type="submit" disabled={isPending} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none">
              {isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
