'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Users, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostDetailDialog } from './post-detail-dialog'

interface Props {
  initialPosts: any[]
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

export function CommunityClient({ initialPosts }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | 'general' | 'help' | 'sports' | 'study' | 'social'>('all')

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      // Category filter
      if (category !== 'all' && post.category !== category) return false

      // Search filter
      if (search) {
        const q = search.toLowerCase()
        if (!post.title.toLowerCase().includes(q) && !post.content?.toLowerCase().includes(q)) {
          return false
        }
      }

      return true
    })
  }, [initialPosts, category, search])

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
  }

  const hasActiveFilters = search || category !== 'all'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
      
      {/* 1. SEARCH & FILTERS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search community posts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 rounded-xl h-11 w-full"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['all', 'general', 'help', 'sports', 'study', 'social'].map(cat => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => setCategory(cat as any)}
              className={`rounded-xl h-11 capitalize whitespace-nowrap flex-shrink-0 ${category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {cat === 'help' ? 'Help/Advice' : cat}
            </Button>
          ))}
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="rounded-xl h-11 px-3 text-slate-500 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. FEED */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredPosts.map(post => (
            <PostDetailDialog key={post.id} post={post}>
              <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full group">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                        {post.profiles?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{post.profiles?.name || 'Student'}</span>
                    </div>
                    
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      {post.category.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold leading-tight line-clamp-2 text-slate-900 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {timeAgo(post.created_at)}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More →
                  </div>
                </div>

              </div>
            </PostDetailDialog>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl animate-in fade-in duration-500">
          <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-slate-300" />
          </div>
          {initialPosts.length === 0 ? (
            <>
              <p className="text-sm font-bold text-slate-900">No community posts yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Be the first to share something with your hostel community.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-900">No matching posts</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search term.</p>
              <Button variant="link" onClick={clearFilters} className="text-blue-600 mt-1 font-semibold">Clear Filters</Button>
            </>
          )}
        </div>
      )}

    </div>
  )
}
