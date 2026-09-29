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
import { reportPurifierProblem } from '@/app/actions/water'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  purifierId: string
  floorId: string
  hostelId: string
  floorNumber: number
}

const PROBLEMS = [
  "No water coming",
  "Water tastes bad",
  "Water is cloudy",
  "Filter needs changing",
  "Machine is leaking",
  "Other"
]

export function ReportProblemDialog({ purifierId, floorId, hostelId, floorNumber }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await reportPurifierProblem(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline">Report Problem</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Water Purifier Problem</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <input type="hidden" name="purifierId" value={purifierId} />
          <input type="hidden" name="floorId" value={floorId} />
          <input type="hidden" name="hostelId" value={hostelId} />
          <input type="hidden" name="floorNumber" value={floorNumber.toString()} />
          
          <div className="text-sm text-slate-700 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Machine:</span>
              <span className="col-span-2">Water Purifier</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Location:</span>
              <span className="col-span-2">Ramanujan Hostel &middot; Floor {floorNumber}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Problem</label>
            <Select name="problem" required>
              <SelectTrigger>
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {PROBLEMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" placeholder="Tell us what happened..." required className="min-h-[100px]" />
          </div>

          {error && <div className="text-red-500 font-medium text-sm">{error}</div>}
          
          <DialogFooter className="mt-4">
            <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Reporting...' : 'Report Problem'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
