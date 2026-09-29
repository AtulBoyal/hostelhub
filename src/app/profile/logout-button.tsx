'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="outline" 
      disabled={isPending}
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 rounded-xl h-11 px-4 font-semibold transition-colors"
      onClick={() => {
        startTransition(async () => {
          await logout()
        })
      }}
    >
      <LogOut className="h-4 w-4 mr-3" />
      {isPending ? 'Logging out...' : 'Log out of HostelHub'}
    </Button>
  )
}
