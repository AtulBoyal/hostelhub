'use client'

import { useState, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { reportPurifierProblem } from '@/app/actions/water'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface Props {
  purifierId: string
  floorId: string
  hostelId: string
  floorNumber: string | number
  fullWidth?: boolean
}

export function ReportProblemDialog({ purifierId, floorId, hostelId, floorNumber, fullWidth = false }: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(reportPurifierProblem, null)
  const [successMode, setSuccessMode] = useState(false)

  // Watch for success state
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => setSuccessMode(true), 0);
      return () => clearTimeout(timer);
    }
  }, [state])

  // Reset state when closing dialog
  useEffect(() => {
    if (!open) {
      setTimeout(() => setSuccessMode(false), 300)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button 
          variant="outline" 
          className={`rounded-xl font-semibold border-slate-200 text-slate-700 hover:text-red-700 hover:border-red-200 hover:bg-red-50 transition-colors ${fullWidth ? 'w-full' : ''}`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report a Problem
        </Button>
      } />
      
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {successMode ? (
          // SUCCESS STATE
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Problem Reported ✓</DialogTitle>
            <DialogDescription className="text-slate-500 text-base">
              The maintenance team has been notified. This purifier has been marked as Not Working.
            </DialogDescription>
            <div className="pt-6 w-full flex gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl flex-1 h-11 font-semibold"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          // FORM STATE
          <>
            <DialogHeader className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                Report Problem
              </DialogTitle>
              <DialogDescription className="text-slate-500 pt-2">
                What is wrong with the water purifier on Floor {floorNumber}?
              </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="p-6 md:p-8 space-y-6">
              
              {/* Hidden Inputs for the server action */}
              <input type="hidden" name="purifierId" value={purifierId} />
              <input type="hidden" name="floorId" value={floorId} />
              <input type="hidden" name="hostelId" value={hostelId} />
              <input type="hidden" name="floorNumber" value={floorNumber} />
              
              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {state.error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-slate-900 font-semibold">Problem Type</Label>
                  <Select name="problem" required>
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select a problem..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Bad taste">Bad taste</SelectItem>
                      <SelectItem value="Bad smell">Bad smell</SelectItem>
                      <SelectItem value="Water not dispensing">Water not dispensing</SelectItem>
                      <SelectItem value="Leakage">Leakage</SelectItem>
                      <SelectItem value="Purifier not working">Purifier not working</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-900 font-semibold">Additional Details</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Provide any additional details to help the maintenance team..." 
                    required 
                    className="rounded-xl min-h-[100px] resize-none border-slate-200 bg-slate-50 focus:bg-white transition-colors p-3"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <DialogClose render={
                  <Button type="button" variant="outline" className="rounded-xl font-semibold h-11 px-6">
                    Cancel
                  </Button>
                } />
                <Button type="submit" disabled={isPending} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold h-11 px-8">
                  {isPending ? 'Reporting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
