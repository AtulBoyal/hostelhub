const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDB() {
  console.log("Checking hostels...");
  const { data: hostels, error: hErr } = await supabase.from('hostels').select('*');
  console.log(hErr ? hErr : hostels);

  console.log("Checking floors...");
  const { data: floors, error: fErr } = await supabase.from('floors').select('*');
  console.log(fErr ? fErr : floors);

  // Attempt to sign up a test user to see if session is returned
  console.log("Attempting test signup...");
  const email = `test_${Date.now()}@example.com`;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test User',
      }
    }
  });
  
  if (authErr) {
    console.error("Auth error:", authErr);
    return;
  }
  
  console.log("Auth user created:", authData.user?.id);
  console.log("Session exists?", !!authData.session);

  console.log("Attempting profile insert...");
  const { data: profile, error: pErr } = await supabase.from('profiles').insert([{
    id: authData.user.id,
    name: 'Test User',
    email: email,
    hostel_id: hostels.length > 0 ? hostels[0].id : null,
    floor_id: floors.length > 0 ? floors[0].id : null,
    room_number: '123'
  }]);

  if (pErr) {
    console.error("Profile Insert Error:", pErr);
  } else {
    console.log("Profile Insert Success");
  }
}

checkDB();
