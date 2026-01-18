<script setup lang="ts">
const { t } = useI18n()
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
  if (len < 8) return { text: t('tools.passwordGenerator.weak'), color: '#ef4444', percent: 25 }
  if (len < 12) return { text: t('tools.passwordGenerator.medium'), color: '#f59e0b', percent: 50 }
  if (len < 16) return { text: t('tools.passwordGenerator.strong'), color: '#10b981', percent: 75 }
  return { text: t('tools.passwordGenerator.veryStrong'), color: '#059669', percent: 100 }
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
    showToast(t('common.copied'))
  } catch (error) {
    console.error('Copy failed:', error)
    showToast(t('common.copyFailed'))
  }
}

watch([length, options], generatePassword, { deep: true })

onMounted(() => {
  generatePassword()
})

useHead({
  title: `${t('tools.passwordGenerator.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.passwordGenerator.metaDescription'),
    },
    { name: 'keywords', content: 'password generator, secure password, random password, strong password' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.passwordGenerator.title')} - ${t('common.title')}` },
    { property: 'og:description', content: t('tools.passwordGenerator.description') },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.passwordGenerator.title')} - ${t('common.title')}` },
    { name: 'twitter:description', content: t('tools.passwordGenerator.description') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('tools.passwordGenerator.title'),
        description: t('tools.passwordGenerator.description'),
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

    <!-- Header -->
    <div class="header">
      <h1 class="header-title">{{ $t('tools.passwordGenerator.title') }}</h1>
      <p class="header-description">{{ $t('tools.passwordGenerator.description') }}</p>
    </div>

    <!-- Password Display -->
    <div class="card password-card">
      <div v-if="!password" class="empty-state">
        <Icon name="mdi:lock" class="empty-icon" />
        <p class="empty-text">{{ $t('tools.passwordGenerator.generatePrompt') }}</p>
      </div>
      <div v-else class="password-display">
        <div class="password-text">{{ password }}</div>
        <div class="password-meta">
          <span class="strength-label">{{ $t('tools.passwordGenerator.strength') }}:</span>
          <span class="strength-value" :style="{ color: strength.color }">
            {{ strength.text }}
          </span>
        </div>
        <div class="strength-bar">
          <div class="strength-progress" :style="{ width: `${strength.percent}%`, background: strength.color }" />
        </div>
        <button class="btn btn-copy" @click="copyToClipboard">
          <Icon name="mdi:content-copy" />
          {{ $t('common.copy') }}
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="card controls">
      <div class="control-group">
        <label for="length" class="control-label">{{ $t('tools.passwordGenerator.length') }}: {{ length }}</label>
        <input
          id="length"
          v-model.number="length"
          type="range"
          min="4"
          max="64"
          class="control-range"
        />
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input v-model="options.uppercase" type="checkbox" class="checkbox-input" />
          <span>{{ $t('tools.passwordGenerator.uppercaseLabel') }}</span>
        </label>
        <label class="checkbox-label">
          <input v-model="options.lowercase" type="checkbox" class="checkbox-input" />
          <span>{{ $t('tools.passwordGenerator.lowercaseLabel') }}</span>
        </label>
        <label class="checkbox-label">
          <input v-model="options.numbers" type="checkbox" class="checkbox-input" />
          <span>{{ $t('tools.passwordGenerator.numbersLabel') }}</span>
        </label>
        <label class="checkbox-label">
          <input v-model="options.symbols" type="checkbox" class="checkbox-input" />
          <span>{{ $t('tools.passwordGenerator.symbolsLabel') }}</span>
        </label>
      </div>

      <button class="btn btn-primary" @click="generatePassword">
        <Icon name="mdi:refresh" />
        {{ $t('tools.passwordGenerator.regenerate') }}
      </button>
    </div>

    <!-- Info -->
    <div class="card info-section">
      <h2 class="info-title">
        <Icon name="mdi:shield-check" />
        {{ $t('tools.passwordGenerator.info.title') }}
      </h2>
      <ul class="info-list">
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.passwordGenerator.info.item1') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.passwordGenerator.info.item2') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.passwordGenerator.info.item3') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.passwordGenerator.info.item4') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.password-card {
  padding: 32px;
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
}

.empty-state {
  padding: 40px 0;

  .empty-icon {
    width: 48px;
    height: 48px;
    color: var(--fe-gray-400);
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    color: var(--fe-gray-500);
  }
}

.password-display {
  .password-text {
    font-family: 'Courier New', monospace;
    font-size: 24px;
    font-weight: 600;
    color: var(--fe-gray-800);
    word-break: break-all;
    padding: 16px;
    background: var(--fe-gray-50);
    border-radius: 8px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  .password-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;

    .strength-label {
      color: var(--fe-gray-600);
    }

    .strength-value {
      font-weight: 600;
    }
  }

  .strength-bar {
    width: 100%;
    height: 8px;
    background: var(--fe-gray-200);
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .strength-progress {
    height: 100%;
    transition: all 0.3s ease;
  }

  .btn-copy {
    background: var(--fe-primary);
    color: white;

    &:hover {
      background: var(--fe-primary-hover);
    }
  }
}

.controls {
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group {
  .control-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--fe-gray-700);
    margin-bottom: 12px;
  }

  .control-range {
    width: 100%;
    height: 4px;
    background: var(--fe-gray-200);
    border-radius: 2px;
    outline: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: var(--fe-primary);
      border-radius: 50%;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: var(--fe-primary);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  }
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--fe-gray-700);
  cursor: pointer;

  .checkbox-input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  &:hover {
    color: var(--fe-primary);
  }
}

.info-section {
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--fe-gray-800);
  margin: 0 0 16px;

  :deep(svg) {
    width: 20px;
    height: 20px;
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
  color: var(--fe-gray-600);
  font-size: 14px;
  line-height: 1.6;

  :deep(svg) {
    width: 18px;
    height: 18px;
    color: var(--fe-success);
    flex-shrink: 0;
    margin-top: 2px;
  }
}
</style>