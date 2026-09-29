'use client'

import { useTransition, useState } from 'react'
import { Bell, Wrench, WashingMachine, Megaphone, Users, Search, Droplets, Wifi, AlertCircle } from 'lucide-react'
import { markNotificationAsRead } from '@/app/actions/notifications'

interface Props {
  initialNotifications: any[]
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'maintenance': return <Wrench className="h-5 w-5 text-orange-600" />
    case 'laundry': return <WashingMachine className="h-5 w-5 text-blue-600" />
    case 'announcement': return <Megaphone className="h-5 w-5 text-amber-600" />
    case 'community': return <Users className="h-5 w-5 text-indigo-600" />
    case 'lost-found': return <Search className="h-5 w-5 text-purple-600" />
    case 'water': return <Droplets className="h-5 w-5 text-cyan-600" />
    case 'wifi': return <Wifi className="h-5 w-5 text-emerald-600" />
    case 'emergency': return <AlertCircle className="h-5 w-5 text-red-600" />
    default: return <Bell className="h-5 w-5 text-slate-600" />
  }
}

function getIconBgColor(type: string) {
  switch (type) {
    case 'maintenance': return 'bg-orange-100'
    case 'laundry': return 'bg-blue-100'
    case 'announcement': return 'bg-amber-100'
    case 'community': return 'bg-indigo-100'
    case 'lost-found': return 'bg-purple-100'
    case 'water': return 'bg-cyan-100'
    case 'wifi': return 'bg-emerald-100'
    case 'emergency': return 'bg-red-100'
    default: return 'bg-slate-100'
  }
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

export function NotificationsClient({ initialNotifications }: Props) {
  const [isPending, startTransition] = useTransition()
  // Local state for optimistic UI updates
  const [optimisticRead, setOptimisticRead] = useState<Set<string>>(new Set())

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (isRead || optimisticRead.has(id) || isPending) return

    // Optimistically mark as read
    const newSet = new Set(optimisticRead)
    newSet.add(id)
    setOptimisticRead(newSet)

    startTransition(async () => {
      await markNotificationAsRead(id)
    })
  }

  if (initialNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl animate-in fade-in duration-500">
        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">You're all caught up</p>
        <p className="text-sm text-slate-500 mt-1">You don't have any notifications right now.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
      {initialNotifications.map(notification => {
        const isRead = notification.is_read || optimisticRead.has(notification.id)
        
        return (
          <div 
            key={notification.id}
            onClick={() => handleMarkRead(notification.id, isRead)}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
              isRead 
                ? 'bg-slate-50 border-transparent shadow-none cursor-default' 
                : 'bg-white border-blue-100 shadow-sm hover:shadow-md cursor-pointer hover:border-blue-200 group'
            }`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-xl shrink-0 transition-colors ${isRead ? 'bg-slate-100 grayscale-[0.5] opacity-60' : getIconBgColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex justify-between items-start gap-4">
                <h4 className={`text-base leading-tight truncate ${isRead ? 'font-semibold text-slate-600' : 'font-bold text-slate-900 group-hover:text-blue-700 transition-colors'}`}>
                  {notification.title}
                </h4>
                
                {/* Unread Indicator */}
                {!isRead && (
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0 mt-1 shadow-sm" aria-label="Unread notification" />
                )}
              </div>
              
              <p className={`text-sm mt-1.5 line-clamp-2 leading-relaxed ${isRead ? 'text-slate-500' : 'text-slate-700'}`}>
                {notification.message}
              </p>
              
              <div className={`text-xs font-medium mt-3 flex items-center gap-1.5 ${isRead ? 'text-slate-400' : 'text-blue-600/70'}`}>
                {timeAgo(notification.created_at)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
