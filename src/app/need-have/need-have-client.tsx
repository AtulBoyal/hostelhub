'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, PackageOpen, Package, UserCircle, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  initialPosts: any[]
  currentUserId: string
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

export function NeedHaveClient({ initialPosts, currentUserId }: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'need' | 'have' | 'mine'>('all')
  const [category, setCategory] = useState<'all' | 'academics' | 'electronics' | 'clothing' | 'miscellaneous'>('all')

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      // Tab filter
      if (activeTab === 'need' && post.type !== 'need') return false
      if (activeTab === 'have' && post.type !== 'have') return false
      if (activeTab === 'mine' && post.user_id !== currentUserId) return false

      // Category filter
      if (category !== 'all' && post.category !== category) return false

      // Search filter
      if (search) {
        const q = search.toLowerCase()
        if (!post.title.toLowerCase().includes(q) && !post.description?.toLowerCase().includes(q)) {
          return false
        }
      }

      return true
    })
  }, [initialPosts, activeTab, category, search, currentUserId])

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
  }

  const hasActiveFilters = search || category !== 'all'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
      
      {/* 1. TABS */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 hide-scrollbar gap-2">
        <Button 
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
          className={`rounded-full px-5 font-semibold transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          All Posts
        </Button>
        <Button 
          variant={activeTab === 'need' ? 'default' : 'outline'}
          onClick={() => setActiveTab('need')}
          className={`rounded-full px-5 font-semibold transition-colors whitespace-nowrap ${activeTab === 'need' ? 'bg-amber-100 text-amber-800 border-transparent hover:bg-amber-200' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          I Need
        </Button>
        <Button 
          variant={activeTab === 'have' ? 'default' : 'outline'}
          onClick={() => setActiveTab('have')}
          className={`rounded-full px-5 font-semibold transition-colors whitespace-nowrap ${activeTab === 'have' ? 'bg-teal-100 text-teal-800 border-transparent hover:bg-teal-200' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          I Have
        </Button>
        <Button 
          variant={activeTab === 'mine' ? 'default' : 'outline'}
          onClick={() => setActiveTab('mine')}
          className={`rounded-full px-5 font-semibold transition-colors whitespace-nowrap ${activeTab === 'mine' ? 'bg-slate-100 text-slate-900 border-transparent hover:bg-slate-200' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          My Posts
        </Button>
      </div>

      {/* 2. SEARCH & FILTERS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search posts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 rounded-xl h-11 w-full"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['all', 'academics', 'electronics', 'clothing', 'miscellaneous'].map(cat => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => setCategory(cat as any)}
              className={`rounded-xl h-11 capitalize whitespace-nowrap flex-shrink-0 ${category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {cat}
            </Button>
          ))}
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="rounded-xl h-11 px-3 text-slate-500 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 3. FEED */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredPosts.map(post => {
            const isNeed = post.type === 'need'
            
            return (
              <div 
                key={post.id} 
                className={`bg-white border rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${isNeed ? 'border-amber-200/60 hover:border-amber-300' : 'border-teal-200/60 hover:border-teal-300'}`}
              >
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    {isNeed ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                        I Need
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-teal-200 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider">
                        I Have
                      </div>
                    )}
                    
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {post.category}
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-bold leading-tight line-clamp-2 ${isNeed ? 'text-amber-950' : 'text-teal-950'}`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <UserCircle className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{post.profiles?.name || 'Student'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {timeAgo(post.created_at)}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl animate-in fade-in duration-500">
          <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Package className="h-7 w-7 text-slate-300" />
          </div>
          {initialPosts.length === 0 ? (
            <>
              <p className="text-sm font-bold text-slate-900">No posts yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Be the first to request something or offer something to the hostel.</p>
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
