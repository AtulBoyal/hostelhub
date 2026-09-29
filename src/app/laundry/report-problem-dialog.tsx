'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { reportMachineProblem } from '@/app/actions/laundry'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wrench } from 'lucide-react'

interface Props {
  machineId: string
  floorId: string
  hostelId: string
  floorNumber: number
}

const PROBLEMS = [
  "Machine doesn't start",
  "Water not coming",
  "Door/lock problem",
  "Excessive noise",
  "Drainage problem",
  "Other"
]

export function ReportProblemDialog({ machineId, floorId, hostelId, floorNumber }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await reportMachineProblem(formData)
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
        <Button variant="outline" className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-300 rounded-lg">
          Report Problem
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Wrench className="h-5 w-5 text-slate-600" />
            </div>
            Report Problem
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="machineId" value={machineId} />
          <input type="hidden" name="floorId" value={floorId} />
          <input type="hidden" name="hostelId" value={hostelId} />
          <input type="hidden" name="floorName" value={floorNumber.toString()} />
          
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
            <label className="text-sm font-semibold text-slate-900">What's wrong?</label>
            <Select name="problem" required>
              <SelectTrigger className="rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="Select problem category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PROBLEMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Additional Details</label>
            <Textarea name="description" placeholder="Tell us more about the issue..." required className="min-h-[100px] rounded-xl border-slate-200 resize-none" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
          
          <DialogFooter className="mt-4 pt-4 border-t border-slate-100 flex gap-2 sm:justify-end">
            <DialogClose render={<Button type="button" variant="outline" className="rounded-xl flex-1 sm:flex-none">Cancel</Button>} />
            <Button type="submit" disabled={isPending} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex-1 sm:flex-none">
              {isPending ? 'Reporting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
