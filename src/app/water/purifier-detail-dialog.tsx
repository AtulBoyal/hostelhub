'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Droplets, MapPin, AlertTriangle } from 'lucide-react'
import { ReportProblemDialog } from './report-problem-dialog'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  floor: { id: string; floor_number: number; computedStatus: string; activeIssue?: { title: string; created_at: string }; purifier?: { id: string; status: string } }
  hostelId: string
  children: React.ReactNode
}

export function PurifierDetailDialog({ floor, hostelId, children }: Props) {
  const [open, setOpen] = useState(false)
  
  const purifier = floor.purifier
  const isWorking = floor.computedStatus === 'working'
  
  if (!purifier) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error shadcn trigger */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {/* Header Area */}
        <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {isWorking ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>Operational</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>Not Working</span>
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            Water Purifier 1
          </DialogTitle>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Floor {floor.floor_number}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-6 text-sm text-slate-700">
          
          {!isWorking && floor.activeIssue ? (
            <div className="bg-red-50/50 rounded-2xl p-5 border border-red-100/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-red-800 uppercase tracking-wider text-xs mb-1">Active Complaint</p>
                  <p className="text-red-900 font-medium leading-relaxed">{floor.activeIssue.title}</p>
                  <p className="text-red-700/70 text-xs mt-2">
                    Reported on {new Date(floor.activeIssue.created_at).toLocaleDateString()} at {new Date(floor.activeIssue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-red-100">
                <Link href="/maintenance" className={buttonVariants({ variant: "outline", className: "w-full bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300 rounded-xl font-semibold" })}>
                  View Maintenance Issue
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Droplets className="h-10 w-10 text-slate-300 mb-3" />
              <p className="font-medium text-slate-800">Purifier is operating normally.</p>
              <p className="text-slate-500 text-xs mt-1">No recent complaints reported.</p>
            </div>
          )}

        </div>

        {/* Footer Area */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <DialogClose render={<Button variant="outline" className="rounded-xl font-semibold px-6 bg-white flex-1 sm:flex-none">Close</Button>} />
          
          {isWorking && (
            <div className="flex-1 sm:flex-none">
              <ReportProblemDialog 
                purifierId={purifier.id} 
                floorId={floor.id} 
                hostelId={hostelId} 
                floorNumber={floor.floor_number}
                fullWidth
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
