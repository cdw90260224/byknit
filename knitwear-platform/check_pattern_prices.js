const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'tester@by-knit.com';
  const patternId = '530ce57b-c397-4936-979b-4ee2470f0730'; // 여름 크로셰 캠프 캡

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, credits')
    .eq('email', email)
    .single();

  console.log(`Tester User ID: ${profile.id} | Credits: ${profile.credits}`);

  const { data: pattern } = await supabase
    .from('patterns')
    .select('id, title, designer_id, price_usd, is_free')
    .eq('id', patternId)
    .single();

  console.log(`Pattern ID: ${pattern.id} | Title: ${pattern.title.ko} | Price USD: ${pattern.price_usd} | is_free: ${pattern.is_free}`);
}

main();
