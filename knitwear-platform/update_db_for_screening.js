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

if (!serviceRoleKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY not found in .env. Cannot run admin actions.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log("=== DB Update for Screening ===");

  // 1. Update pattern prices
  const updates = [
    { id: '530ce57b-c397-4936-979b-4ee2470f0730', price_usd: 5, label: "여름 크로셰 캠프 캡" },
    { id: '95f1714d-675e-42ef-9014-9b5bd31d0af5', price_usd: 9, label: "남자 썸머 린넨 오픈카라 반팔 니트" },
    { id: 'b345855f-2b88-4350-9d8d-3312df3202a7', price_usd: 6, label: "네츄럴 와이어 라피아 햇" }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from('patterns')
      .update({ price_usd: item.price_usd })
      .eq('id', item.id);

    if (error) {
      console.error(`Failed to update price for ${item.label}:`, error);
    } else {
      console.log(`Successfully updated ${item.label} price to $${item.price_usd}`);
    }
  }

  // 2. Create tester account
  const email = 'tester@by-knit.com';
  const password = 'knitwear2026!';

  console.log(`Checking if tester account ${email} exists...`);
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Failed to list users:", listError);
    return;
  }

  const existingTester = usersData.users.find(u => u.email === email);

  if (existingTester) {
    console.log(`Tester account already exists (ID: ${existingTester.id}). Updating password just in case...`);
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingTester.id,
      { password: password }
    );
    if (updateError) {
      console.error("Failed to update password:", updateError);
    } else {
      console.log("Password updated successfully.");
    }
  } else {
    console.log(`Tester account does not exist. Creating new user...`);
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (createError) {
      console.error("Failed to create tester user:", createError);
    } else {
      console.log(`Tester user created successfully (ID: ${createData.user.id}).`);
      
      // profiles is created automatically by database trigger, but let's give them some initial credits for testing credit payment
      const { data: profileUpdate, error: profileError } = await supabase
        .from('profiles')
        .update({ credits: 100 }) // Give 100 credits for testing
        .eq('id', createData.user.id);
        
      if (profileError) {
        console.error("Failed to update profile credits:", profileError);
      } else {
        console.log("Granted 100 test credits to tester profile.");
      }
    }
  }
}

main();
