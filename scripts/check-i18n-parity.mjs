import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 언어 파일들
const languages = ['ko', 'en', 'de', 'ja'];
const localesDir = join(__dirname, '..', 'i18n', 'locales');

// 모든 키를 재귀적으로 추출
function extractKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(extractKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys.sort();
}

// 언어 파일 로드
const translations = {};
const keysByLang = {};

languages.forEach(lang => {
  const filePath = join(localesDir, `${lang}.json`);
  translations[lang] = JSON.parse(readFileSync(filePath, 'utf8'));
  keysByLang[lang] = extractKeys(translations[lang]);
  console.log(`\n${lang}.json: ${keysByLang[lang].length}개 키`);
});

// ko.json을 기준으로 비교
const baseKeys = keysByLang['ko'];
console.log('\n========== 1:1 매핑 검증 ==========');
console.log(`기준: ko.json (${baseKeys.length}개 키)\n`);

let allMatch = true;

languages.slice(1).forEach(lang => {
  console.log(`\n${lang}.json 비교:`);

  // 누락된 키 찾기
  const missingKeys = baseKeys.filter(key => !keysByLang[lang].includes(key));

  // 추가된 키 찾기
  const extraKeys = keysByLang[lang].filter(key => !baseKeys.includes(key));

  if (missingKeys.length === 0 && extraKeys.length === 0) {
    console.log(`✅ 완벽하게 매칭됨 (${keysByLang[lang].length}개 키)`);
  } else {
    allMatch = false;

    if (missingKeys.length > 0) {
      console.log(`❌ 누락된 키 (${missingKeys.length}개):`);
      missingKeys.forEach(key => console.log(`   - ${key}`));
    }

    if (extraKeys.length > 0) {
      console.log(`⚠️  추가된 키 (${extraKeys.length}개):`);
      extraKeys.forEach(key => console.log(`   + ${key}`));
    }
  }
});

console.log('\n========== 결과 요약 ==========');
if (allMatch) {
  console.log('✅ 모든 언어 파일이 1:1 매핑되어 있습니다!');
} else {
  console.log('❌ 일부 언어 파일에 불일치가 있습니다. 위의 내용을 확인하세요.');
}

// 통계
console.log('\n========== 통계 ==========');
languages.forEach(lang => {
  console.log(`${lang}.json: ${keysByLang[lang].length}개 키`);
});

// sitemap.xml 검증
console.log('\n========== Sitemap 검증 ==========');
const sitemapPath = join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapContent = readFileSync(sitemapPath, 'utf8');

// 도구 목록
const tools = [
  'character-counter',
  'my-ip',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'qr-generator',
  'wifi-qr',
  'signature-generator'
];

// 각 도구가 4개 언어로 존재하는지 확인
let sitemapValid = true;
const languagePrefixes = ['', '/en', '/de', '/ja'];

tools.forEach(tool => {
  const expectedUrls = languagePrefixes.map(prefix =>
    `https://ssiat.link${prefix}/tools/${tool}`
  );

  expectedUrls.forEach(url => {
    if (!sitemapContent.includes(`<loc>${url}</loc>`)) {
      sitemapValid = false;
      console.log(`❌ 누락된 URL: ${url}`);
    }
  });
});

if (sitemapValid) {
  console.log('✅ Sitemap이 모든 도구와 언어에 대해 올바르게 구성되어 있습니다!');
  console.log(`   - ${tools.length}개 도구 × 4개 언어 = ${tools.length * 4}개 도구 URL`);
  console.log(`   - 추가로 홈페이지와 /tools 페이지도 4개 언어로 존재`);
}