<script setup lang="ts">
const password = ref('')
const length = ref(16)
const options = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
})

const strength = computed(() => {
  const len = password.value.length
  if (len === 0) return { text: '', color: '', percent: 0 }
  if (len < 8) return { text: '약함', color: '#ef4444', percent: 25 }
  if (len < 12) return { text: '보통', color: '#f59e0b', percent: 50 }
  if (len < 16) return { text: '강함', color: '#10b981', percent: 75 }
  return { text: '매우 강함', color: '#059669', percent: 100 }
})

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = ''
  if (options.value.uppercase) chars += uppercase
  if (options.value.lowercase) chars += lowercase
  if (options.value.numbers) chars += numbers
  if (options.value.symbols) chars += symbols

  if (chars === '') {
    password.value = ''
    return
  }

  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
}

const { showToast } = useToast()

const copyToClipboard = async () => {
  if (!password.value) return

  try {
    await navigator.clipboard.writeText(password.value)
    showToast('복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

watch([length, options], generatePassword, { deep: true })

onMounted(() => {
  generatePassword()
})

useHead({
  title: '비밀번호 생성기 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        '안전하고 강력한 랜덤 비밀번호를 생성하는 도구입니다. 대문자, 소문자, 숫자, 특수문자를 조합하여 보안성 높은 비밀번호를 만드세요.',
    },
    {
      name: 'keywords',
      content: '비밀번호생성기, 랜덤비밀번호, 보안비밀번호, 강력한비밀번호, 패스워드생성기',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '비밀번호 생성기 - 무설치 유팉리티' },
    { property: 'og:description', content: '안전하고 강력한 랜덤 비밀번호를 생성' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: '비밀번호 생성기 - 무설치 유팉리티' },
    { name: 'twitter:description', content: '안전하고 강력한 랜덤 비밀번호를 생성' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '비밀번호 생성기',
        description: '안전하고 강력한 랜덤 비밀번호를 생성하는 도구',
        applicationCategory: 'UtilityApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
      }),
    },
  ],
})
</script>

<template>
  <div>
    <div class="page-header">
      <CommonBackButton />
      <CommonShareButton />
    </div>

    <div class="header">
      <h1 class="header-title">비밀번호 생성기</h1>
      <p class="header-description">안전하고 강력한 비밀번호를 생성하세요</p>
    </div>

    <div class="content">
      <!-- Password Display -->
      <div class="password-card card">
        <div class="password-display">
          <code class="password-text">{{ password || '비밀번호를 생성하세요' }}</code>
          <button v-if="password" class="btn-copy-icon" @click="copyToClipboard">
            <Icon name="mdi:content-copy" />
          </button>
        </div>
        <div v-if="password" class="strength-bar">
          <div class="strength-label">
            <span>강도:</span>
            <span :style="{ color: strength.color }">{{ strength.text }}</span>
          </div>
          <div class="strength-progress">
            <div
              class="strength-fill"
              :style="{
                width: strength.percent + '%',
                backgroundColor: strength.color,
              }"
            />
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="card control-card">
        <div class="control-section">
          <label class="control-label">
            길이: <strong>{{ length }}</strong>
          </label>
          <input v-model.number="length" type="range" min="4" max="64" class="control-slider" />
        </div>

        <div class="checkbox-grid">
          <label class="checkbox-item">
            <input v-model="options.uppercase" type="checkbox" class="checkbox-input" />
            <span class="checkbox-label">대문자 (A-Z)</span>
          </label>
          <label class="checkbox-item">
            <input v-model="options.lowercase" type="checkbox" class="checkbox-input" />
            <span class="checkbox-label">소문자 (a-z)</span>
          </label>
          <label class="checkbox-item">
            <input v-model="options.numbers" type="checkbox" class="checkbox-input" />
            <span class="checkbox-label">숫자 (0-9)</span>
          </label>
          <label class="checkbox-item">
            <input v-model="options.symbols" type="checkbox" class="checkbox-input" />
            <span class="checkbox-label">특수문자 (!@#$...)</span>
          </label>
        </div>

        <button class="btn btn-primary btn-full" @click="generatePassword">
          <Icon name="mdi:refresh" />
          새로 생성
        </button>
      </div>

      <!-- Info -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          안전한 비밀번호 만들기
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>최소 12자 이상의 길이를 권장합니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>대문자, 소문자, 숫자, 특수문자를 모두 포함하세요</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>생성된 비밀번호는 브라우저에서만 처리되며 저장되지 않습니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>동일한 비밀번호를 여러 사이트에서 사용하지 마세요</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 페이지 고유 스타일만 작성
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.password-card {
  background: var(--fe-primary);
  color: white;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.password-text {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 18px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  word-break: break-all;
  min-height: 56px;
  display: flex;
  align-items: center;
}

.btn-copy-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.strength-bar {
  margin-top: 16px;
}

.strength-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;

  span:first-child {
    opacity: 0.9;
  }
}

.strength-progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.control-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);

  strong {
    color: var(--fe-primary);
  }
}

.control-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--fe-gray-200);
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--fe-primary);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--fe-primary);
    cursor: pointer;
    border: none;
  }
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--fe-gray-50);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--fe-gray-100);
  }
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--fe-primary);
}

.checkbox-label {
  font-size: 14px;
  color: var(--fe-gray-700);
  cursor: pointer;
}

.btn-full {
  width: 100%;
}

.info-section {
  margin-top: 8px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin: 0 0 20px;

  :deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--fe-primary);
  }
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--fe-gray-50);
  border-radius: 8px;
  font-size: 14px;
  color: var(--fe-gray-600);
  line-height: 1.5;

  :deep(svg) {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--fe-primary);
    margin-top: 2px;
  }
}

@media (max-width: 768px) {
  .password-text {
    font-size: 14px;
  }
}
</style>
