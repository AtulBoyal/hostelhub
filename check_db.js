require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: hostels, error: he } = await supabase.from('hostels').select('*');
  console.log('Hostels:', hostels, he);
  
  const { data: floors, error: fe } = await supabase.from('floors').select('*, washing_machines(*)');
  console.log('Floors:', JSON.stringify(floors, null, 2), fe);
}

check().catch(console.error);
