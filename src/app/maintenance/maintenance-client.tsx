'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Wrench, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IssueDetailDialog } from './issue-detail-dialog'

interface Props {
  initialIssues: any[]
  currentUserId: string
}

export function MaintenanceClient({ initialIssues, currentUserId }: Props) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [category, setCategory] = useState('all')
  const [mineOnly, setMineOnly] = useState(false)
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // 2. OVERVIEW SUMMARY
  const summary = useMemo(() => {
    return {
      all: initialIssues.length,
      open: initialIssues.filter(i => i.status === 'reported').length,
      inProgress: initialIssues.filter(i => i.status === 'in_progress').length,
      resolved: initialIssues.filter(i => i.status === 'resolved').length
    }
  }, [initialIssues])

  // FILTERING LOGIC
  const filteredIssues = useMemo(() => {
    return initialIssues.filter(issue => {
      if (mineOnly && issue.reported_by !== currentUserId) return false;
      if (status !== 'all' && issue.status !== status) return false;
      if (priority !== 'all' && issue.priority !== priority) return false;
      if (category !== 'all' && issue.category !== category) return false;
      
      if (search) {
        const q = search.toLowerCase();
        if (!issue.title.toLowerCase().includes(q) && !issue.description?.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    })
  }, [initialIssues, search, status, priority, category, mineOnly, currentUserId])

  const hasActiveFilters = search || status !== 'all' || priority !== 'all' || category !== 'all' || mineOnly;

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setPriority('all')
    setCategory('all')
    setMineOnly(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75 fill-mode-both">
      
      {/* 2. OVERVIEW SUMMARY */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
          <span className="text-xs font-semibold text-slate-700">All Issues</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{summary.all}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-slate-700">Open</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{summary.open}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-slate-700">In Progress</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{summary.inProgress}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-default">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-slate-700">Resolved</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{summary.resolved}</span>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search issues..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 rounded-xl w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="md:hidden flex-1 rounded-xl"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button 
              variant={mineOnly ? "default" : "outline"}
              onClick={() => setMineOnly(!mineOnly)}
              className={`rounded-xl flex-1 md:flex-none transition-colors ${mineOnly ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
            >
              My Issues
            </Button>
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 md:flex ${showFiltersMobile ? 'flex' : 'hidden md:flex'}`}>
          <Select value={status} onValueChange={(val) => setStatus(val || 'all')}>
            <SelectTrigger className="w-full md:w-[150px] rounded-xl bg-slate-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="reported">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(val) => setPriority(val || 'all')}>
            <SelectTrigger className="w-full md:w-[150px] rounded-xl bg-slate-50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={(val) => setCategory(val || 'all')}>
            <SelectTrigger className="w-full md:w-[150px] rounded-xl bg-slate-50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="bathroom">Bathroom</SelectItem>
              <SelectItem value="fan_ac">Fan / AC</SelectItem>
              <SelectItem value="wifi">Wi-Fi</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="rounded-xl text-slate-500 hover:text-slate-900 px-3">
              <X className="h-4 w-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* 4. ISSUE LIST */}
      <div className="pt-2 animate-in fade-in duration-500 delay-150 fill-mode-both">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <Wrench className="h-10 w-10 text-slate-300 mb-4" />
            {initialIssues.length === 0 ? (
              <>
                <p className="text-sm font-medium text-slate-900">No maintenance issues</p>
                <p className="text-xs text-slate-500 mt-1">Everything looks good right now.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-900">No issues match your filters</p>
                <Button variant="link" onClick={clearFilters} className="text-blue-600 mt-1">Clear Filters</Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredIssues.map(issue => {
              
              // 5. & 6. STATUS / PRIORITY FORMATTING
              let StatusIcon = <span className="h-2 w-2 rounded-full bg-slate-400" />
              let statusText = "UNKNOWN"
              if (issue.status === 'reported') {
                StatusIcon = <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                statusText = "OPEN"
              } else if (issue.status === 'in_progress') {
                StatusIcon = <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                statusText = "IN PROGRESS"
              } else if (issue.status === 'resolved') {
                StatusIcon = <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                statusText = "RESOLVED"
              }

              let priorityColor = "text-slate-500 bg-slate-100"
              let priorityIcon = "⚪"
              if (issue.priority === 'high' || issue.priority === 'emergency') {
                priorityColor = "text-red-700 bg-red-100/50"
                priorityIcon = "🔴"
              } else if (issue.priority === 'medium') {
                priorityColor = "text-amber-700 bg-amber-100/50"
                priorityIcon = "🟡"
              } else if (issue.priority === 'low') {
                priorityColor = "text-slate-600 bg-slate-100"
                priorityIcon = "🟢"
              }

              return (
                <IssueDetailDialog key={issue.id} issue={issue}>
                  <div className="group text-left w-full cursor-pointer bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[160px]">
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-100 ${priorityColor}`}>
                          <span>{priorityIcon}</span>
                          <span>{issue.priority} Priority</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
                          {StatusIcon}
                          <span>{statusText}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                        {issue.title}
                      </h3>
                      
                      <p className="text-sm text-slate-500 capitalize flex items-center gap-2">
                        <span>{issue.category.replace('_', ' ')}</span>
                        <span className="text-slate-300">•</span>
                        <span>{issue.floors ? `Floor ${issue.floors.floor_number}` : 'Common Area'}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-xs text-slate-400 font-medium">
                        Reported {new Date(issue.created_at).toLocaleDateString()} {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 -translate-x-2 group-hover:translate-x-0 duration-200">
                        View Details <span className="text-[14px]">→</span>
                      </span>
                    </div>

                  </div>
                </IssueDetailDialog>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
