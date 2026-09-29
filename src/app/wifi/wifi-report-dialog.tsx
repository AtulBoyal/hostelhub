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
import { createMaintenanceIssue } from '@/app/actions/maintenance'
import { Wifi, CheckCircle2, AlertTriangle } from 'lucide-react'

interface Props {
  floorNumber: string | number
}

export function WifiReportDialog({ floorNumber }: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createMaintenanceIssue, null)
  const [successMode, setSuccessMode] = useState(false)

  // Watch for success state
  useEffect(() => {
    if (state?.success) {
      setSuccessMode(true)
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
        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-semibold px-5 h-11 w-full sm:w-auto">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Wi-Fi Problem
        </Button>
      } />
      
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {successMode ? (
          // SUCCESS STATE
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Issue Reported ✓</DialogTitle>
            <DialogDescription className="text-slate-500 text-base">
              Your network issue has been submitted successfully. The IT team has been notified.
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
                <div className="h-10 w-10 bg-slate-200/50 rounded-full flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-slate-700" />
                </div>
                Report Wi-Fi Problem
              </DialogTitle>
              <DialogDescription className="text-slate-500 pt-2">
                Experiencing network issues? Let us know what's happening.
              </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="p-6 md:p-8 space-y-6">
              
              {/* Hidden Inputs for the server action */}
              <input type="hidden" name="category" value="wifi" />
              <input type="hidden" name="priority" value="high" /> {/* Networks issues are usually high priority */}
              
              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {state.error}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm flex justify-between items-center">
                <span className="font-semibold text-slate-700">Location</span>
                <span className="text-slate-900 font-medium bg-white px-3 py-1 rounded-full border border-slate-200">
                  Floor {floorNumber}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-900 font-semibold">Problem Type</Label>
                  <Select name="title" required>
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select a problem..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Wi-Fi: No connection">No connection</SelectItem>
                      <SelectItem value="Wi-Fi: Slow connection">Slow connection</SelectItem>
                      <SelectItem value="Wi-Fi: Frequent disconnections">Frequent disconnections</SelectItem>
                      <SelectItem value="Wi-Fi: Authentication/login problem">Authentication/login problem</SelectItem>
                      <SelectItem value="Wi-Fi: Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-900 font-semibold">Additional Details</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="e.g. Wi-Fi disconnects every few minutes in my room..." 
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
                <Button type="submit" disabled={isPending} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11 px-8">
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
