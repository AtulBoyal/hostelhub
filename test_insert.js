const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { data, error } = await supabase.from('profiles').insert([
    {
      id: '12345678-1234-1234-1234-123456789012', // fake uuid
      name: 'Test User',
      email: 'test@example.com',
      room_number: '101'
    }
  ]);
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded:', data);
  }
}

testInsert();
