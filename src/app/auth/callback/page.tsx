import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AuthCallbackPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const code = searchParams.code as string;
  const next = (searchParams.next as string) ?? '/dashboard';
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
        
        if (!profile) {
          if (user.user_metadata?.hostel_id) {
            const { error: insertError } = await supabase.from('profiles').insert([{
              id: user.id,
              name: user.user_metadata.full_name || 'Unknown',
              email: user.email,
              hostel_id: user.user_metadata.hostel_id,
              floor_id: user.user_metadata.floor_id,
              room_number: user.user_metadata.room_number,
              contribution_points: 0
            }]);
            if (!insertError) {
               redirect(next)
            }
          }
          redirect('/onboarding')
        }
      }
      redirect(next)
    }
  }

  // Error case
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-red-600">Google sign-in could not be completed</h2>
        <p className="text-slate-500">There was an issue authenticating your account. Please try again.</p>
        <div className="pt-4 flex flex-col gap-3">
          <Link href="/login" className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-5 font-bold transition-colors">
            Try again
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-3 px-5 font-bold transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
