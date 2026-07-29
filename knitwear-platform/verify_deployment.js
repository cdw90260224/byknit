const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log("\n1. [DB 검증] 패턴 가격 및 테스트 계정 확인");
  
  // Verify patterns prices
  const { data: patterns, error: pError } = await supabase
    .from('patterns')
    .select('id, title, price_usd')
    .in('id', [
      '530ce57b-c397-4936-979b-4ee2470f0730', // 캠프캡
      '95f1714d-675e-42ef-9014-9b5bd31d0af5', // 린넨 반팔
      'b345855f-2b88-4350-9d8d-3312df3202a7'  // 라피아 햇
    ]);

  if (pError) {
    console.error("  ❌ 패턴 조회 실패:", pError);
  } else {
    console.log("  ✓ 패턴 가격 조회 결과:");
    patterns.forEach(p => {
      console.log(`    - ${p.title.ko || p.title.en}: $${p.price_usd} (ID: ${p.id})`);
    });
  }

  // Verify tester account
  const email = 'tester@by-knit.com';
  const { data: profiles, error: prError } = await supabase
    .from('profiles')
    .select('id, email, credits')
    .eq('email', email)
    .single();

  if (prError) {
    console.error(`  ❌ 테스트 계정(${email}) 조회 실패:`, prError);
  } else {
    console.log(`  ✓ 테스트 계정 확인 완료: ID=${profiles.id}, Email=${profiles.email}, Credits=${profiles.credits}`);
  }
}

async function verifyHtml(url, label, searchTerms) {
  console.log(`\n2. [실시간 배포 검증] ${label} 페이지 HTML 확인 (${url})`);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`  ❌ 페이지 요청 실패 (상태 코드: ${response.status})`);
      return;
    }

    const html = await response.text();
    console.log("  ✓ 페이지 응답 성공. 키워드 검색 중...");

    searchTerms.forEach(term => {
      const found = html.includes(term);
      if (found) {
        console.log(`    - [성공] "${term}" 키워드가 HTML 내에 존재함.`);
      } else {
        console.warn(`    - [실패] "${term}" 키워드를 찾지 못함. (아직 배포 빌드가 완료되지 않았을 수 있습니다.)`);
      }
    });
  } catch (e) {
    console.error("  ❌ 페이지 요청 중 네트워크 오류:", e.message);
  }
}

async function main() {
  await verifyDatabase();
  
  // Verify home page footer (Korean)
  await verifyHtml(
    'https://by-knit.com/ko',
    '메인 홈 (ko)',
    ['010-2265-4321', '2019-광주북구-0895', '84컴퍼니']
  );

  // Verify pattern detail page content
  await verifyHtml(
    'https://by-knit.com/ko/marketplace/530ce57b-c397-4936-979b-4ee2470f0730',
    '캠프캡 상세 페이지 (ko)',
    ['디지털 상품 배송 및 환불 규정', '교환 및 반품 불가 안내', '환불 프로세스']
  );
}

main();
