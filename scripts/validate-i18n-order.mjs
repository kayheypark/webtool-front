import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localesDir = join(__dirname, '..', 'i18n', 'locales');

// 깊은 객체 필드 순서 비교
function compareFieldOrder(obj1, obj2, path = '') {
  const issues = [];

  if (typeof obj1 !== 'object' || obj1 === null) {
    return issues;
  }

  if (Array.isArray(obj1)) {
    return issues;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // obj1에 있는 키들의 순서 확인
  const commonKeys = keys1.filter(k => keys2.includes(k));
  const keys2Common = keys2.filter(k => keys1.includes(k));

  // 공통 키들의 순서가 같은지 확인
  const orderMatches = JSON.stringify(commonKeys) === JSON.stringify(keys2Common);

  if (!orderMatches) {
    issues.push({
      path: path || 'root',
      expected: commonKeys,
      actual: keys2Common
    });
  }

  // 중첩된 객체들도 재귀적으로 확인
  for (const key of commonKeys) {
    if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
      const nestedIssues = compareFieldOrder(obj1[key], obj2[key], path ? `${path}.${key}` : key);
      issues.push(...nestedIssues);
    }
  }

  return issues;
}

// 메인 검증 함수
function validateI18nOrder() {
  console.log('🔍 i18n 파일 순서 검증 시작...\n');

  // 1. 모든 언어 파일 로드
  const languages = ['ko', 'en', 'de', 'ja'];
  const translations = {};

  for (const lang of languages) {
    const filePath = join(localesDir, `${lang}.json`);
    translations[lang] = JSON.parse(readFileSync(filePath, 'utf8'));
  }

  // 2. 한국어를 기준으로 각 언어 비교
  const reference = translations.ko;
  let hasIssues = false;

  for (const lang of ['en', 'de', 'ja']) {
    console.log(`\n📋 ${lang.toUpperCase()} 검증:`);

    const issues = compareFieldOrder(reference, translations[lang]);

    if (issues.length === 0) {
      console.log(`✅ 모든 레벨에서 필드 순서가 한국어와 일치합니다.`);
    } else {
      hasIssues = true;
      console.log(`❌ ${issues.length}개 위치에서 필드 순서 불일치 발견:`);

      for (const issue of issues.slice(0, 5)) { // 처음 5개만 표시
        console.log(`   📍 ${issue.path}:`);
        console.log(`      예상: ${issue.expected.slice(0, 5).join(', ')}${issue.expected.length > 5 ? '...' : ''}`);
        console.log(`      실제: ${issue.actual.slice(0, 5).join(', ')}${issue.actual.length > 5 ? '...' : ''}`);
      }

      if (issues.length > 5) {
        console.log(`   ... 그 외 ${issues.length - 5}개 더`);
      }
    }

    // 추가 필드 확인
    const extraKeys = Object.keys(translations[lang]).filter(k => !Object.keys(reference).includes(k));
    if (extraKeys.length > 0) {
      console.log(`   ℹ️ 추가 필드: ${extraKeys.join(', ')}`);
    }
  }

  // 3. 요약
  console.log('\n========== 검증 요약 ==========');

  if (!hasIssues) {
    console.log('✅ 모든 언어 파일의 필드 순서가 완벽하게 일치합니다!');
  } else {
    console.log('❌ 일부 언어 파일에서 필드 순서 불일치가 발견되었습니다.');
    console.log('   scripts/fix-i18n-order.mjs를 실행하여 수정할 수 있습니다.');
  }

  // 4. 1단계 필드 통계
  console.log('\n========== 1단계 필드 ==========');
  for (const lang of languages) {
    const keys = Object.keys(translations[lang]);
    console.log(`${lang}.json: ${keys.join(', ')}`);
  }
}

// 실행
try {
  validateI18nOrder();
} catch (error) {
  console.error('❌ 검증 중 오류 발생:', error);
  process.exit(1);
}