import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 언어 파일들
const languages = ['ko', 'en', 'de', 'ja'];
const localesDir = join(__dirname, '..', 'i18n', 'locales');

// JSON 파일을 정렬된 형태로 저장
function sortObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortObject);

  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObject(obj[key]);
  });
  return sorted;
}

// 모든 키를 재귀적으로 추출
function extractKeys(obj, prefix = '') {
  let keys = {};

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(keys, extractKeys(obj[key], fullKey));
    } else {
      keys[fullKey] = obj[key];
    }
  }

  return keys;
}

// 중첩된 객체로 변환
function buildNestedObject(flatKeys) {
  const result = {};

  for (const [fullKey, value] of Object.entries(flatKeys)) {
    const keys = fullKey.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

// 메인 동기화 함수
function syncTranslations() {
  console.log('🔄 i18n 동기화 시작...\n');

  // 1. 모든 언어 파일 로드
  const translations = {};
  languages.forEach(lang => {
    const filePath = join(localesDir, `${lang}.json`);
    translations[lang] = JSON.parse(readFileSync(filePath, 'utf8'));
    console.log(`📖 ${lang}.json 로드 완료`);
  });

  // 2. 한국어를 기준으로 키 추출
  const baseKeys = extractKeys(translations.ko);
  const enKeys = extractKeys(translations.en);
  console.log(`\n✅ 기준 키 수: ${Object.keys(baseKeys).length}개\n`);

  // 3. 독일어와 일본어 동기화
  let syncCount = { de: 0, ja: 0 };

  ['de', 'ja'].forEach(lang => {
    console.log(`\n🌍 ${lang.toUpperCase()} 동기화 중...`);
    const currentKeys = extractKeys(translations[lang]);

    // 누락된 키 찾기 및 추가
    for (const [key, value] of Object.entries(baseKeys)) {
      if (!currentKeys[key]) {
        // 영어 번역을 기본값으로 사용
        currentKeys[key] = enKeys[key] || value;
        syncCount[lang]++;
        console.log(`  + ${key}`);
      }
    }

    // 중첩된 객체로 변환
    const nestedObj = buildNestedObject(currentKeys);

    // 정렬된 JSON으로 저장
    const sortedObj = sortObject(nestedObj);
    const filePath = join(localesDir, `${lang}.json`);
    writeFileSync(filePath, JSON.stringify(sortedObj, null, 2) + '\n', 'utf8');

    console.log(`✅ ${lang}.json: ${syncCount[lang]}개 키 추가됨`);
  });

  // 4. 최종 검증
  console.log('\n========== 동기화 결과 ==========');
  languages.forEach(lang => {
    const filePath = join(localesDir, `${lang}.json`);
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    const keys = extractKeys(content);
    console.log(`${lang}.json: ${Object.keys(keys).length}개 키`);
  });

  console.log('\n✨ i18n 동기화 완료!');

  // 5. 번역 필요 항목 리포트
  console.log('\n========== 번역 필요 항목 ==========');
  if (syncCount.de > 0) {
    console.log(`🇩🇪 독일어: ${syncCount.de}개 키가 영어로 임시 설정됨`);
  }
  if (syncCount.ja > 0) {
    console.log(`🇯🇵 일본어: ${syncCount.ja}개 키가 영어로 임시 설정됨`);
  }

  if (syncCount.de === 0 && syncCount.ja === 0) {
    console.log('✅ 모든 번역이 완료된 상태입니다!');
  }
}

// 실행
try {
  syncTranslations();
} catch (error) {
  console.error('❌ 동기화 중 오류 발생:', error);
  process.exit(1);
}