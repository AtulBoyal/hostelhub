import { cache } from 'react';
import { createClient } from './supabase/server';

/**
 * Cached function to get the current user and their profile data.
 * React cache() ensures that even if this is called in layout.tsx and page.tsx,
 * the Supabase queries only run ONCE per request.
 */
export const getCachedAuthUser = cache(async () => {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { user: null, profile: null };
  }

  // 2. Fetch full profile with joined hostel and floor names
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, hostels(name), floors(floor_number)')
    .eq('id', user.id)
    .single();

  return { user, profile };
});
