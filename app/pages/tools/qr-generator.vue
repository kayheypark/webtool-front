<script setup lang="ts">
const { t } = useI18n()
const text = ref('')
const qrSize = ref(256)
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const qrCodeDataUrl = ref('')
const isGenerating = ref(false)

const errorLevels = computed(() => [
  { value: 'L', label: t('tools.qrGenerator.low'), description: t('tools.qrGenerator.errorLevelLow') },
  { value: 'M', label: t('tools.qrGenerator.medium'), description: t('tools.qrGenerator.errorLevelMedium') },
  { value: 'Q', label: t('tools.qrGenerator.quartile'), description: t('tools.qrGenerator.errorLevelQuartile') },
  { value: 'H', label: t('tools.qrGenerator.high'), description: t('tools.qrGenerator.errorLevelHigh') },
])

// QR Code generation using qrcode library approach
const generateQRCode = async () => {
  if (!text.value.trim()) {
    qrCodeDataUrl.value = ''
    return
  }

  isGenerating.value = true

  try {
    // Use QRCode.js via CDN or implement a simple QR code generator
    // For now, we'll use a public API as a fallback
    const encoded = encodeURIComponent(text.value)
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize.value}x${qrSize.value}&data=${encoded}&ecc=${errorLevel.value}`
    qrCodeDataUrl.value = url
  } catch (error) {
    console.error('QR code generation failed:', error)
  } finally {
    isGenerating.value = false
  }
}

// Watch for changes
watch([text, qrSize, errorLevel], () => {
  generateQRCode()
})

const handleClear = () => {
  text.value = ''
  qrCodeDataUrl.value = ''
}

const { showToast } = useToast()

const handleDownload = () => {
  if (!qrCodeDataUrl.value) {
    showToast(t('tools.qrGenerator.generateFirst'))
    return
  }

  const link = document.createElement('a')
  link.href = qrCodeDataUrl.value
  link.download = `qrcode-${Date.now()}.png`
  link.click()
  showToast(t('tools.qrGenerator.downloadSuccess'))
}

const handleCopyImage = async () => {
  if (!qrCodeDataUrl.value) {
    showToast(t('tools.qrGenerator.generateFirst'))
    return
  }

  try {
    const response = await fetch(qrCodeDataUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    showToast(t('tools.qrGenerator.copySuccess'))
  } catch (error) {
    console.error('Copy failed:', error)
    showToast(t('common.copyFailed'))
  }
}

useHead({
  title: `${t('tools.qrGenerator.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.qrGenerator.metaDescription'),
    },
    {
      name: 'keywords',
      content: 'QR code generator, QR generator, create QR code, text to QR, URL to QR',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.qrGenerator.title')} - ${t('common.title')}` },
    { property: 'og:description', content: t('tools.qrGenerator.description') },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.qrGenerator.title')} - ${t('common.title')}` },
    { name: 'twitter:description', content: t('tools.qrGenerator.description') },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('tools.qrGenerator.title'),
        description: t('tools.qrGenerator.description'),
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
      <h1 class="header-title">{{ $t('tools.qrGenerator.title') }}</h1>
      <p class="header-description">{{ $t('tools.qrGenerator.description') }}</p>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Input Section -->
      <div class="input-section">
        <div class="card">
          <div class="form-group">
            <label class="label">{{ $t('tools.qrGenerator.textOrUrl') }}</label>
            <textarea
              v-model="text"
              class="textarea"
              :placeholder="$t('tools.qrGenerator.inputPlaceholder')"
              rows="4"
            />
          </div>

          <div class="form-group">
            <label class="label"> {{ $t('tools.qrGenerator.size') }}: {{ qrSize }}px </label>
            <input
              v-model.number="qrSize"
              type="range"
              min="128"
              max="512"
              step="64"
              class="slider"
            />
            <div class="slider-labels">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          <div class="form-group">
            <label class="label">{{ $t('tools.qrGenerator.errorCorrection') }}</label>
            <div class="radio-group">
              <label
                v-for="level in errorLevels"
                :key="level.value"
                class="radio-label"
                :class="{ active: errorLevel === level.value }"
              >
                <input v-model="errorLevel" type="radio" :value="level.value" class="radio-input" />
                <div class="radio-content">
                  <div class="radio-title">{{ level.label }}</div>
                  <div class="radio-description">{{ level.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <div class="button-group">
            <button class="btn btn-secondary" @click="handleClear">
              <Icon name="mdi:delete" />
              {{ $t('common.reset') }}
            </button>
          </div>
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="qr-section">
        <div class="card qr-card">
          <div v-if="!qrCodeDataUrl" class="qr-placeholder">
            <Icon name="mdi:qrcode" />
            <p>{{ $t('tools.qrGenerator.placeholderText') }}</p>
          </div>

          <div v-else class="qr-display">
            <div v-if="isGenerating" class="qr-loading">
              <div class="spinner" />
              <p>{{ $t('tools.qrGenerator.generating') }}</p>
            </div>
            <img v-else :src="qrCodeDataUrl" alt="QR Code" class="qr-image" />
          </div>

          <div v-if="qrCodeDataUrl" class="qr-actions">
            <button class="btn btn-primary" @click="handleDownload">
              <Icon name="mdi:download" />
              {{ $t('common.download') }}
            </button>
            <button class="btn btn-primary" @click="handleCopyImage">
              <Icon name="mdi:content-copy" />
              {{ $t('common.copy') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="card info-section">
      <h2 class="info-title">
        <Icon name="mdi:information" />
        {{ $t('tools.qrGenerator.info.title') }}
      </h2>
      <ul class="info-list">
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.qrGenerator.info.item1') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.qrGenerator.info.item2') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.qrGenerator.info.item3') }}</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>{{ $t('tools.qrGenerator.info.item4') }}</span>
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
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin-bottom: 8px;
}

.textarea {
  width: 100%;
  padding: 12px;
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

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--fe-gray-200);
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--fe-primary);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 8px var(--fe-primary-light);
    }
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

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--fe-gray-500);
}

.radio-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.radio-label {
  position: relative;
  cursor: pointer;
  padding: 16px;
  border: 2px solid var(--fe-border-light);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--fe-primary);
    background: var(--fe-primary-light);
  }

  &.active {
    border-color: var(--fe-primary);
    background: var(--fe-primary-light);
  }
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
}

.radio-description {
  font-size: 12px;
  color: var(--fe-gray-500);
}

.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.qr-placeholder {
  text-align: center;
  color: var(--fe-gray-400);

  :deep(svg) {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
}

.qr-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qr-loading {
  text-align: center;
  color: var(--fe-gray-500);

  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--fe-gray-200);
  border-top-color: var(--fe-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--fe-shadow-sm);
}

.qr-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
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
  .info-list {
    grid-template-columns: 1fr;
  }
}
</style>