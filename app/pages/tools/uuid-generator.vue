<script setup lang="ts">
const { t } = useI18n()
const uuids = ref<string[]>([])
const count = ref(1)

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const handleGenerate = () => {
  const newUUIDs = []
  for (let i = 0; i < count.value; i++) {
    newUUIDs.push(generateUUID())
  }
  uuids.value = newUUIDs
}

const { showToast } = useToast()

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast(t('common.copied'))
  } catch (error) {
    console.error('Copy failed:', error)
    showToast(t('common.copyFailed'))
  }
}

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(uuids.value.join('\n'))
    showToast(t('tools.uuidGenerator.copiedAll'))
  } catch (error) {
    console.error('Copy failed:', error)
    showToast(t('common.copyFailed'))
  }
}

onMounted(() => {
  handleGenerate()
})

useHead({
  title: `${t('tools.uuidGenerator.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.uuidGenerator.metaDescription'),
    },
    { name: 'keywords', content: 'UUID, GUID, UUID Generator, Random UUID, UUID v4' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.uuidGenerator.title')} - ${t('common.title')}` },
    { property: 'og:description', content: t('tools.uuidGenerator.description') },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.uuidGenerator.title')} - ${t('common.title')}` },
    { name: 'twitter:description', content: t('tools.uuidGenerator.description') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('tools.uuidGenerator.title'),
        description: t('tools.uuidGenerator.description'),
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
      <h1 class="header-title">{{ $t('tools.uuidGenerator.title') }}</h1>
      <p class="header-description">{{ $t('tools.uuidGenerator.description') }}</p>
    </div>

    <!-- Main Result Display -->
    <div v-if="uuids.length > 0" class="result-section">
      <!-- Single UUID Display -->
      <div v-if="uuids.length === 1" class="single-result card">
        <div class="uuid-display">
          <code class="uuid-code">{{ uuids[0] }}</code>
        </div>
        <div class="result-actions">
          <button class="btn btn-primary" @click="copyToClipboard(uuids[0] ?? '')">
            <Icon name="mdi:content-copy" />
            {{ $t('common.copy') }}
          </button>
          <button class="btn btn-secondary" @click="handleGenerate">
            <Icon name="mdi:refresh" />
            {{ $t('common.generate') }}
          </button>
        </div>
      </div>

      <!-- Multiple UUIDs Display -->
      <div v-else class="multiple-results">
        <div class="result-header">
          <h3 class="result-title">
            {{ $t('tools.uuidGenerator.generatedUuids') }} ({{ uuids.length }})
          </h3>
          <button class="btn btn-primary btn-sm" @click="copyAll">
            <Icon name="mdi:content-copy" />
            {{ $t('tools.uuidGenerator.copyAll') }}
          </button>
        </div>
        <div class="uuid-list card">
          <div
            v-for="(uuid, index) in uuids"
            :key="index"
            class="uuid-item"
            @click="copyToClipboard(uuid)"
          >
            <span class="uuid-index">{{ index + 1 }}</span>
            <span class="uuid-text">{{ uuid }}</span>
            <button class="uuid-copy-btn" @click.stop="copyToClipboard(uuid)">
              <Icon name="mdi:content-copy" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="card controls">
      <h3 class="controls-title">{{ $t('tools.uuidGenerator.options') }}</h3>
      <div class="control-row">
        <div class="control-group">
          <label for="count" class="control-label">{{ $t('tools.uuidGenerator.quantity') }}</label>
          <div class="quantity-input-wrapper">
            <button
              class="quantity-btn"
              :disabled="count <= 1"
              @click="count = Math.max(1, count - 1)"
            >
              <Icon name="mdi:minus" />
            </button>
            <input
              id="count"
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="control-input"
            />
            <button
              class="quantity-btn"
              :disabled="count >= 100"
              @click="count = Math.min(100, count + 1)"
            >
              <Icon name="mdi:plus" />
            </button>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-full" @click="handleGenerate">
        <Icon name="mdi:refresh" />
        {{ $t('common.generate') }} {{ count > 1 ? `(${count})` : '' }}
      </button>
    </div>

    <!-- Info -->
    <div class="card info-section">
      <h2 class="info-title">
        <Icon name="mdi:information" />
        {{ $t('tools.uuidGenerator.info.title') }}
      </h2>
      <ul class="info-list">
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.uuidGenerator.info.item1') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.uuidGenerator.info.item2') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.uuidGenerator.info.item3') }}</span>
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

// Result Section
.result-section {
  margin-bottom: 24px;
}

.single-result {
  padding: 32px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
}

.uuid-display {
  margin-bottom: 24px;
  padding: 24px;
  background: var(--fe-gray-50);
  border-radius: 12px;
  border: 2px solid var(--fe-border-light);
}

.uuid-code {
  font-family:
    'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--fe-primary);
  letter-spacing: 0.5px;
  user-select: all;

  @media (max-width: 768px) {
    font-size: 14px;
    word-break: break-all;
  }
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}

.multiple-results {
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }

  .result-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--fe-gray-700);
    margin: 0;
  }
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;

  :deep(svg) {
    width: 16px;
    height: 16px;
  }
}

.btn-full {
  width: 100%;
}

// Controls
.controls {
  margin-bottom: 24px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
    margin-bottom: 0;
  }
}

.controls-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin: 0 0 20px;
}

.control-row {
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.control-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--fe-gray-700);
  margin-bottom: 4px;
}

.control-input {
  flex: 1;
  padding: 10px 16px;
  font-size: 15px;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--fe-primary);
    box-shadow: 0 0 0 3px rgba(var(--fe-primary-rgb), 0.1);
  }
}

.quantity-input-wrapper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  background: white;
  overflow: hidden;
  margin-top: 8px;

  .control-input {
    border: none;
    border-radius: 0;
    text-align: center;
    width: 80px;
    padding: 8px 4px;
    font-size: 15px;
    background: transparent;

    &:focus {
      outline: none;
      box-shadow: none;
      background: var(--fe-gray-50);
    }

    /* Remove number input spinners */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: var(--fe-gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: var(--fe-gray-50);
    color: var(--fe-primary);
  }

  &:active:not(:disabled) {
    background: var(--fe-gray-100);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    color: var(--fe-gray-400);
  }

  &:first-of-type {
    border-right: 1px solid var(--fe-border-light);
  }

  &:last-of-type {
    border-left: 1px solid var(--fe-border-light);
  }
}

.uuid-list {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--fe-gray-100);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--fe-gray-400);
    border-radius: 3px;

    &:hover {
      background: var(--fe-gray-500);
    }
  }
}

.uuid-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--fe-primary-light);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--fe-border-light);
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
  }
}

.uuid-index {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fe-gray-100);
  color: var(--fe-gray-600);
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
}

.uuid-text {
  flex: 1;
  font-family:
    'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 14px;
  color: var(--fe-gray-800);
  word-break: break-all;
  user-select: all;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.uuid-copy-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--fe-gray-500);
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
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
