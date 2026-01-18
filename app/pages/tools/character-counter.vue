<script setup lang="ts">
const { t } = useI18n()
const text = ref('')

const characterCount = computed(() => text.value.length)

const characterCountWithoutSpaces = computed(() => {
  return text.value.replace(/\s/g, '').length
})

const wordCount = computed(() => {
  const trimmed = text.value.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
})

const lineCount = computed(() => {
  if (!text.value) return 0
  return text.value.split('\n').length
})

const byteCount = computed(() => {
  return new Blob([text.value]).size
})

const handleClear = () => {
  text.value = ''
}

const { showToast } = useToast()

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(text.value)
    showToast(t('common.copied'))
  } catch (error) {
    console.error('복사 실패:', error)
    showToast(t('common.copyFailed'))
  }
}

useHead({
  title: `${t('tools.characterCounter.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.characterCounter.description'),
    },
    { name: 'keywords', content: '글자수세기, 단어수세기, 바이트계산, 텍스트분석, 문자수카운터' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.characterCounter.title')} - ${t('common.title')}` },
    {
      property: 'og:description',
      content: t('tools.characterCounter.description'),
    },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.characterCounter.title')} - ${t('common.title')}` },
    {
      name: 'twitter:description',
      content: t('tools.characterCounter.description'),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('tools.characterCounter.title'),
        description: t('tools.characterCounter.description'),
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
      <h1 class="header-title">{{ $t('tools.characterCounter.title') }}</h1>
      <p class="header-description">{{ $t('tools.characterCounter.description') }}</p>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Editor -->
      <div class="editor-section">
        <div class="card">
          <textarea
            v-model="text"
            class="textarea"
            :placeholder="$t('tools.characterCounter.placeholder')"
            rows="16"
            @input="(e) => (text = (e.target as HTMLTextAreaElement).value)"
          />
          <div class="button-group">
            <button class="btn btn-secondary" @click="handleClear">
              <Icon name="mdi:delete" />
              {{ $t('common.reset') }}
            </button>
            <button class="btn btn-primary" @click="handleCopy">
              <Icon name="mdi:content-copy" />
              {{ $t('common.copy') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <div class="stat-card primary">
          <div class="stat-label">{{ $t('tools.characterCounter.stats.characters') }}</div>
          <div class="stat-value">{{ characterCount.toLocaleString() }}</div>
        </div>

        <div class="card stats-card">
          <div class="stat-item">
            <div class="stat-icon">
              <Icon name="mdi:text" />
            </div>
            <div class="stat-info">
              <div class="stat-small-label">{{ $t('tools.characterCounter.stats.charactersNoSpaces') }}</div>
              <div class="stat-small-value">
                {{ characterCountWithoutSpaces.toLocaleString() }}
              </div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <Icon name="mdi:format-text" />
            </div>
            <div class="stat-info">
              <div class="stat-small-label">{{ $t('tools.characterCounter.stats.words') }}</div>
              <div class="stat-small-value">{{ wordCount.toLocaleString() }}</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <Icon name="mdi:format-line-spacing" />
            </div>
            <div class="stat-info">
              <div class="stat-small-label">{{ $t('tools.characterCounter.stats.lines') }}</div>
              <div class="stat-small-value">{{ lineCount.toLocaleString() }}</div>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <Icon name="mdi:database" />
            </div>
            <div class="stat-info">
              <div class="stat-small-label">{{ $t('tools.characterCounter.stats.bytes') }}</div>
              <div class="stat-small-value">{{ byteCount.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="card info-section">
      <h2 class="info-title">
        <Icon name="mdi:information" />
        {{ $t('tools.characterCounter.info.title') }}
      </h2>
      <ul class="info-list">
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.characterCounter.info.item1') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.characterCounter.info.item2') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.characterCounter.info.item3') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.characterCounter.info.item4') }}</span>
        </li>
      </ul>
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 2px solid var(--fe-border-light);
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--fe-gray-700);
  resize: vertical;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--fe-primary);
  }

  &::placeholder {
    color: var(--fe-gray-400);
  }
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  &.primary {
    background: var(--fe-primary);
    color: white;
    padding: 32px 24px;
    text-align: center;
  }
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--fe-gray-50);
  border-radius: 8px;
}

.stat-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;

  :deep(svg) {
    width: 20px;
    height: 20px;
    color: var(--fe-primary);
  }
}

.stat-info {
  flex: 1;
}

.stat-small-label {
  font-size: 12px;
  color: var(--fe-gray-500);
  margin-bottom: 4px;
}

.stat-small-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--fe-gray-700);
}

.info-section {
  margin-top: 32px;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
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
  .stat-value {
    font-size: 36px;
  }

  .info-list {
    grid-template-columns: 1fr;
  }
}
</style>
