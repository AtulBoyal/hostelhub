'use client'

import { ReactNode, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Clock, User } from 'lucide-react'

interface PostDetailDialogProps {
  children: ReactNode
  post: any
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function PostDetailDialog({ children, post }: PostDetailDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="cursor-pointer h-full flex flex-col">
        {children}
      </div>
      <DialogContent className="sm:max-w-[650px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {/* Header Area */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block shadow-sm">
              {post.category.replace('_', ' ')}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {post.profiles?.name?.charAt(0) || '?'}
                </div>
                {post.profiles?.name || 'Student'}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(post.created_at)}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 -mr-2 -mt-2 shrink-0"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-slate prose-p:leading-relaxed max-w-none">
            <p className="text-slate-800 text-base md:text-lg whitespace-pre-wrap font-medium">
              {post.content}
            </p>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button variant="outline" className="rounded-xl font-semibold px-6 bg-white shadow-sm w-full sm:w-auto" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
