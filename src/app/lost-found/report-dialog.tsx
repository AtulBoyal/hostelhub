'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { reportLostFoundItem } from '@/app/actions/lost-found'

export function ReportDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(reportLostFoundItem, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Report Item</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Lost or Found Item</DialogTitle>
          <DialogDescription>
            Help reunite items with their owners.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            {state?.error && <div className="text-sm text-red-500">{state.error}</div>}
            {state?.success && <div className="text-sm text-green-600">{state.success}</div>}

            <div className="grid gap-2">
              <Label htmlFor="type">Report Type</Label>
              <Select name="type" required defaultValue="lost">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">I lost something</SelectItem>
                  <SelectItem value="found">I found something</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Item Name</Label>
              <Input id="title" name="title" placeholder="e.g. Blue Water Bottle" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Near Mess, Floor 2 Washroom" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Brand, color, identifiable marks..." 
                className="col-span-3" 
                required 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
