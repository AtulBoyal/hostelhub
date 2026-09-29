'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Bell, AlertCircle, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnnouncementDetailDialog } from './announcement-detail-dialog'

interface Props {
  initialAnnouncements: any[]
}

// Simple relative time helper
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

export function AnnouncementsClient({ initialAnnouncements }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'important'>('all')

  // FILTERING LOGIC
  const filtered = useMemo(() => {
    return initialAnnouncements.filter(item => {
      if (filter === 'important' && item.priority !== 'urgent' && item.priority !== 'important') return false;
      
      if (search) {
        const q = search.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.content?.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    })
  }, [initialAnnouncements, search, filter])

  // SEPARATE INTO IMPORTANT (HERO) vs OTHERS
  // We only pin important stuff if there is NO search active, to keep search results pure.
  const showPinnedSection = search === '' && filter === 'all'
  
  const pinnedAnnouncements = useMemo(() => {
    if (!showPinnedSection) return []
    return filtered.filter(i => i.priority === 'urgent' || i.priority === 'important').slice(0, 3) // pin up to 3
  }, [filtered, showPinnedSection])

  const feedAnnouncements = useMemo(() => {
    if (!showPinnedSection) return filtered
    // Exclude the ones we already pinned
    const pinnedIds = new Set(pinnedAnnouncements.map(p => p.id))
    return filtered.filter(i => !pinnedIds.has(i.id))
  }, [filtered, showPinnedSection, pinnedAnnouncements])

  const hasActiveFilters = search || filter !== 'all';

  const clearFilters = () => {
    setSearch('')
    setFilter('all')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
      
      {/* 1. SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search announcements..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 rounded-xl w-full h-11"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant={filter === 'all' ? "default" : "outline"}
            onClick={() => setFilter('all')}
            className={`rounded-xl flex-1 sm:flex-none transition-colors h-11 ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
          >
            All
          </Button>
          <Button 
            variant={filter === 'important' ? "default" : "outline"}
            onClick={() => setFilter('important')}
            className={`rounded-xl flex-1 sm:flex-none transition-colors h-11 ${filter === 'important' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent' : 'bg-white text-slate-700'}`}
          >
            <Bell className="h-4 w-4 mr-1.5" />
            Important
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="rounded-xl text-slate-500 hover:text-slate-900 px-3 h-11 hidden sm:flex">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl animate-in fade-in duration-500">
          <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-7 w-7 text-slate-300" />
          </div>
          {initialAnnouncements.length === 0 ? (
            <>
              <p className="text-sm font-bold text-slate-900">No announcements yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">You're all caught up. New hostel notices will appear here.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-900">No announcements match your search</p>
              <Button variant="link" onClick={clearFilters} className="text-blue-600 mt-1 font-semibold">Clear Filters</Button>
            </>
          )}
        </div>
      )}

      {/* 3. PINNED IMPORTANT SECTION */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <h2 className="text-lg font-bold text-slate-900 px-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            Important Notices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map((item) => (
              <AnnouncementDetailDialog key={item.id} announcement={item}>
                <div className="group text-left cursor-pointer bg-amber-50/40 border border-amber-100 hover:border-amber-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {item.priority === 'urgent' ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                          <AlertCircle className="h-3 w-3" /> Urgent
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                          📌 Important
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-[11px] font-medium text-amber-900/60">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.created_at)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-amber-700 transition-colors mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 -translate-x-2 group-hover:translate-x-0 duration-200">
                      Read announcement <span className="text-[14px]">→</span>
                    </span>
                  </div>
                  
                </div>
              </AnnouncementDetailDialog>
            ))}
          </div>
        </div>
      )}

      {/* 4. CHRONOLOGICAL FEED */}
      {feedAnnouncements.length > 0 && (
        <div className="space-y-4 pt-4 animate-in fade-in duration-500 delay-150">
          <h2 className="text-lg font-bold text-slate-900 px-1">
            {showPinnedSection ? 'Recent Announcements' : 'Search Results'}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {feedAnnouncements.map((item) => {
              const isUrgent = item.priority === 'urgent'
              const isImportant = item.priority === 'important'
              
              return (
                <AnnouncementDetailDialog key={item.id} announcement={item}>
                  <div className="group text-left cursor-pointer bg-white border border-slate-200 hover:border-blue-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      
                      <div className="flex-1 space-y-1.5 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          {isUrgent ? (
                            <span className="px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-700 text-[9px] font-bold uppercase tracking-wider">Urgent</span>
                          ) : isImportant ? (
                            <span className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-wider">Important</span>
                          ) : null}
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {item.content}
                        </p>
                      </div>

                      <div className="hidden sm:flex text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all items-center gap-1 -translate-x-2 group-hover:translate-x-0 duration-200 whitespace-nowrap">
                        Read more <span className="text-[14px]">→</span>
                      </div>
                      
                    </div>
                  </div>
                </AnnouncementDetailDialog>
              )
            })}
          </div>
        </div>
      )}
      
    </div>
  )
}
