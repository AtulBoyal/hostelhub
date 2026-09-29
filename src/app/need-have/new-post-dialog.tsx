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
import { createNeedHavePost } from '@/app/actions/need-have'
import { PackagePlus, CheckCircle2 } from 'lucide-react'

export function NewPostDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createNeedHavePost, null)
  const [successMode, setSuccessMode] = useState(false)
  const [postType, setPostType] = useState('need')

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
        setPostType('need')
      }, 300)
    }
  }, [open])

  const isNeed = postType === 'need'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-semibold px-5 h-11 w-full sm:w-auto">
          <PackagePlus className="h-4 w-4 mr-2" />
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
            <DialogHeader className={`p-6 md:p-8 border-b ${isNeed ? 'bg-amber-50/50 border-amber-100' : 'bg-teal-50/50 border-teal-100'} transition-colors duration-300`}>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isNeed ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                  <PackagePlus className="h-5 w-5" />
                </div>
                Post to Community
              </DialogTitle>
              <DialogDescription className="text-slate-500 pt-2">
                Are you looking for something, or do you have something to share?
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
                  <Label htmlFor="type" className="text-slate-900 font-semibold">What do you want to do?</Label>
                  <Select name="type" required value={postType} onValueChange={(val) => val && setPostType(val)}>
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="need">I Need Something</SelectItem>
                      <SelectItem value="have">I Have Something to Share</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-900 font-semibold">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder={isNeed ? "e.g. Need a scientific calculator for tomorrow" : "e.g. Sharing my extra room heater"} 
                    required 
                    className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
                  <Select name="category" required defaultValue="academics">
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="academics">Academics</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-900 font-semibold">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder={isNeed ? "Details about what you need, for how long, etc." : "Details about the item you are offering..."}
                    required 
                    className="rounded-xl min-h-[100px] resize-none border-slate-200 bg-slate-50 focus:bg-white transition-colors p-3"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <DialogClose render={
                  <Button type="button" variant="outline" className="rounded-xl font-semibold h-11 px-6">
                    Cancel
                  </Button>
                } />
                <Button type="submit" disabled={isPending} className={`rounded-xl text-white font-semibold h-11 px-8 ${isNeed ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}`}>
                  {isPending ? 'Posting...' : 'Post Item'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
