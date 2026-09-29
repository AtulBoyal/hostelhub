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
import { Wrench, MapPin, User, Clock, CheckCircle2 } from 'lucide-react'

interface Props {
  issue: any
  children: React.ReactNode
}

export function IssueDetailDialog({ issue, children }: Props) {
  const [open, setOpen] = useState(false)

  let StatusIcon = <span className="h-3 w-3 rounded-full bg-slate-400" />
  let statusText = "UNKNOWN"
  let statusColor = "bg-slate-100 text-slate-800"
  
  if (issue.status === 'reported') {
    StatusIcon = <span className="h-3 w-3 rounded-full bg-blue-500" />
    statusText = "OPEN"
    statusColor = "bg-blue-50 border-blue-100 text-blue-800"
  } else if (issue.status === 'in_progress') {
    StatusIcon = <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
    statusText = "IN PROGRESS"
    statusColor = "bg-amber-50 border-amber-100 text-amber-800"
  } else if (issue.status === 'resolved') {
    StatusIcon = <span className="h-3 w-3 rounded-full bg-green-500" />
    statusText = "RESOLVED"
    statusColor = "bg-green-50 border-green-100 text-green-800"
  }

  let priorityColor = "text-slate-600 bg-slate-100 border-slate-200"
  let priorityIcon = "🟢"
  if (issue.priority === 'high' || issue.priority === 'emergency') {
    priorityColor = "text-red-700 bg-red-50 border-red-100"
    priorityIcon = "🔴"
  } else if (issue.priority === 'medium') {
    priorityColor = "text-amber-700 bg-amber-50 border-amber-100"
    priorityIcon = "🟡"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as any} />
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {/* Header Area */}
        <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusColor}`}>
              {StatusIcon}
              <span>{statusText}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${priorityColor}`}>
              <span>{priorityIcon}</span>
              <span>{issue.priority}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
              <Wrench className="h-3 w-3" />
              <span>{issue.category.replace('_', ' ')}</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
            {issue.title}
          </DialogTitle>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-6 text-sm text-slate-700">
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-800">
            <p className="whitespace-pre-wrap leading-relaxed">{issue.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-slate-100 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Location</p>
                <p className="text-slate-500 mt-0.5">{issue.floors ? `Floor ${issue.floors.floor_number}` : 'Common Area'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-slate-100 p-2 rounded-lg">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Reported By</p>
                <p className="text-slate-500 mt-0.5">{issue.profiles?.name || 'A Student'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-slate-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Reported On</p>
                <p className="text-slate-500 mt-0.5">
                  {new Date(issue.created_at).toLocaleDateString()} at {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {issue.status === 'resolved' && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Resolved On</p>
                  <p className="text-slate-500 mt-0.5">
                    {/* Assuming updated_at signifies resolution if status is resolved */}
                    {new Date(issue.updated_at || issue.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <DialogClose render={<Button variant="outline" className="rounded-xl font-semibold px-6 bg-white">Close Details</Button>} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
