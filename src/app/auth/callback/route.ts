import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user has a profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
        
        if (!profile) {
          // If they have metadata (e.g. from email signup), auto-create the profile
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
            
            if (insertError) {
              console.error("Profile auto-creation error in callback:", insertError);
            } else {
              return NextResponse.redirect(`${origin}${next}`);
            }
          }
          // If no profile exists and no complete metadata (e.g. Google auth), send to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
