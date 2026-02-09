const fs = require('fs');
const path = require('path');

// 언어 파일들
const languages = ['ko', 'en', 'de', 'ja'];
const localesDir = path.join(__dirname, '..', 'i18n', 'locales');

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
  const filePath = path.join(localesDir, `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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