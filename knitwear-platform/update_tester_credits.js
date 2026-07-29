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
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = 'tester@by-knit.com';
  
  // Get tester profile ID
  const { data: profile, error: fError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (fError || !profile) {
    console.error("Tester profile not found:", fError);
    return;
  }

  // Update credits to 100,000
  const { data: updateRes, error: uError } = await supabase
    .from('profiles')
    .update({ credits: 100000 })
    .eq('id', profile.id);

  if (uError) {
    console.error("Failed to update credits:", uError);
  } else {
    console.log(`Successfully updated ${email} credits to 100,000 Credits!`);
  }
}

main();
