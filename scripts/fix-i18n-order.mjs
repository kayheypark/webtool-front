import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localesDir = join(__dirname, '..', 'i18n', 'locales');

// 깊은 객체 순서 정렬 함수
function orderObjectByReference(target, reference) {
  if (typeof reference !== 'object' || reference === null) {
    return target;
  }

  if (Array.isArray(reference)) {
    return target;
  }

  const ordered = {};

  // 먼저 reference의 키 순서대로 추가
  for (const key of Object.keys(reference)) {
    if (key in target) {
      if (typeof reference[key] === 'object' && reference[key] !== null && !Array.isArray(reference[key])) {
        // 중첩된 객체도 재귀적으로 정렬
        ordered[key] = orderObjectByReference(target[key], reference[key]);
      } else {
        ordered[key] = target[key];
      }
    }
  }

  // target에만 있는 추가 키들을 마지막에 추가 (알파벳 순)
  const extraKeys = Object.keys(target).filter(key => !(key in reference)).sort();
  for (const key of extraKeys) {
    ordered[key] = target[key];
  }

  return ordered;
}

// 메인 함수
function fixI18nOrder() {
  console.log('🔄 i18n 파일 순서 정렬 시작...\n');

  // 1. 한국어를 기준으로 로드
  const koPath = join(localesDir, 'ko.json');
  const koContent = JSON.parse(readFileSync(koPath, 'utf8'));
  console.log('📖 ko.json을 기준으로 로드 완료');

  // 2. 다른 언어 파일들 처리
  const languages = ['en', 'de', 'ja'];

  for (const lang of languages) {
    console.log(`\n🌍 ${lang.toUpperCase()} 처리 중...`);

    const filePath = join(localesDir, `${lang}.json`);
    const content = JSON.parse(readFileSync(filePath, 'utf8'));

    // 한국어 구조에 맞게 정렬
    const ordered = orderObjectByReference(content, koContent);

    // 파일 저장
    writeFileSync(filePath, JSON.stringify(ordered, null, 2) + '\n', 'utf8');

    // 변경 사항 체크
    const originalKeys = JSON.stringify(Object.keys(content));
    const orderedKeys = JSON.stringify(Object.keys(ordered));

    if (originalKeys !== orderedKeys) {
      console.log(`✅ ${lang}.json: 1단계 필드 순서 수정됨`);
      console.log(`   이전: ${Object.keys(content).join(', ')}`);
      console.log(`   이후: ${Object.keys(ordered).join(', ')}`);
    } else {
      console.log(`✅ ${lang}.json: 1단계 필드 순서 이미 일치`);
    }

    // 추가 필드 확인
    const extraKeys = Object.keys(content).filter(key => !(key in koContent));
    if (extraKeys.length > 0) {
      console.log(`⚠️  ${lang}.json에만 있는 추가 필드: ${extraKeys.join(', ')}`);
    }
  }

  console.log('\n========== 최종 검증 ==========');

  // 3. 모든 파일의 1단계 필드 순서 확인
  const allLanguages = ['ko', 'en', 'de', 'ja'];
  const firstLevelKeys = {};

  for (const lang of allLanguages) {
    const filePath = join(localesDir, `${lang}.json`);
    const content = JSON.parse(readFileSync(filePath, 'utf8'));
    firstLevelKeys[lang] = Object.keys(content);
  }

  // 한국어 기준으로 비교
  const koKeys = firstLevelKeys.ko;
  let allMatch = true;

  for (const lang of ['en', 'de', 'ja']) {
    const langKeys = firstLevelKeys[lang];

    // 한국어에 있는 키들의 순서 확인
    const koOrderMatch = koKeys.every((key) => {
      const langIndex = langKeys.indexOf(key);
      if (langIndex === -1) return true; // 해당 언어에 없는 키는 무시
      return langKeys.indexOf(key) === langKeys.findIndex(k => koKeys.includes(k) && langKeys.indexOf(k) >= langIndex);
    });

    if (!koOrderMatch) {
      allMatch = false;
      console.log(`❌ ${lang}.json: 필드 순서 불일치`);
    } else {
      console.log(`✅ ${lang}.json: 필드 순서 일치`);
    }

    // 추가 필드 표시
    const extraInLang = langKeys.filter(k => !koKeys.includes(k));
    if (extraInLang.length > 0) {
      console.log(`   └─ 추가 필드: ${extraInLang.join(', ')}`);
    }
  }

  if (allMatch) {
    console.log('\n✨ 모든 언어 파일의 필드 순서가 한국어 기준으로 정렬되었습니다!');
  } else {
    console.log('\n⚠️ 일부 불일치가 있습니다. 수동 확인이 필요할 수 있습니다.');
  }

  // 4. 통계
  console.log('\n========== 통계 ==========');
  for (const lang of allLanguages) {
    const keys = firstLevelKeys[lang];
    console.log(`${lang}.json: 1단계 필드 ${keys.length}개 - ${keys.join(', ')}`);
  }
}

// 실행
try {
  fixI18nOrder();
} catch (error) {
  console.error('❌ 정렬 중 오류 발생:', error);
  process.exit(1);
}