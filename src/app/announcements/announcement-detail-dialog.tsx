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
import { Bell, AlertCircle, Clock } from 'lucide-react'

interface Props {
  announcement: any
  children: React.ReactNode
}

export function AnnouncementDetailDialog({ announcement, children }: Props) {
  const [open, setOpen] = useState(false)
  
  const isImportant = announcement.priority === 'urgent' || announcement.priority === 'important'
  const isUrgent = announcement.priority === 'urgent'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {/* Header Area */}
        <div className={`p-6 md:p-8 border-b ${isUrgent ? 'bg-red-50/50 border-red-100' : isImportant ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            
            {isUrgent ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-200 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <AlertCircle className="h-3 w-3" />
                <span>Urgent</span>
              </div>
            ) : isImportant ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Bell className="h-3 w-3" />
                <span>Important</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider">
                <Bell className="h-3 w-3" />
                <span>Notice</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {new Date(announcement.created_at).toLocaleDateString()} at {new Date(announcement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
          </div>
          
          <DialogTitle className={`text-2xl md:text-3xl font-extrabold leading-tight ${isUrgent ? 'text-red-900' : 'text-slate-900'}`}>
            {announcement.title}
          </DialogTitle>
        </div>

        {/* Content Area - Designed for reading */}
        <div className="p-6 md:p-8">
          <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button variant="outline" className="rounded-xl font-semibold px-6 bg-white shadow-sm w-full sm:w-auto" onClick={() => setOpen(false)}>
            Close Announcement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
