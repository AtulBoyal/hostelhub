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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createCommunityPost } from '@/app/actions/community'
import { Edit3, CheckCircle2 } from 'lucide-react'

export function NewPostDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createCommunityPost, null)
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
      setTimeout(() => {
        setSuccessMode(false)
      }, 300)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-semibold px-5 h-11 w-full sm:w-auto">
          <Edit3 className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      } />
      
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden bg-white">
        
        {successMode ? (
          // SUCCESS STATE
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Post Published ✓</DialogTitle>
            <DialogDescription className="text-slate-500 text-base">
              Your post has been successfully added to the community board.
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
            <DialogHeader className="p-6 md:p-8 border-b bg-slate-50 border-slate-100">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Edit3 className="h-5 w-5" />
                </div>
                Write a Post
              </DialogTitle>
              <DialogDescription className="text-slate-500 pt-2">
                Share an event, ask a question, or post a general update.
              </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="p-6 md:p-8 space-y-6">
              
              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {state.error}
                </div>
              )}

              <div className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-900 font-semibold">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g. Weekend Cricket Match" 
                    required 
                    className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
                  <Select name="category" required defaultValue="general">
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="help">Help / Advice</SelectItem>
                      <SelectItem value="sports">Sports / Games</SelectItem>
                      <SelectItem value="study">Study Group</SelectItem>
                      <SelectItem value="social">Social Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-900 font-semibold">What's on your mind?</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    placeholder="Write your post here..."
                    required 
                    className="rounded-xl min-h-[120px] resize-none border-slate-200 bg-slate-50 focus:bg-white transition-colors p-3"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <DialogClose render={
                  <Button type="button" variant="outline" className="rounded-xl font-semibold h-11 px-6">
                    Cancel
                  </Button>
                } />
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold h-11 px-8">
                  {isPending ? 'Posting...' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
