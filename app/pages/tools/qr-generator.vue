<script setup lang="ts">
const text = ref('')
const qrSize = ref(256)
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const qrCodeDataUrl = ref('')
const isGenerating = ref(false)

const errorLevels = [
  { value: 'L', label: '낮음 (7%)', description: '작은 손상 복구' },
  { value: 'M', label: '중간 (15%)', description: '보통 손상 복구' },
  { value: 'Q', label: '높음 (25%)', description: '큰 손상 복구' },
  { value: 'H', label: '최고 (30%)', description: '최대 손상 복구' },
]

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
    console.error('QR 코드 생성 실패:', error)
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
    showToast('먼저 QR 코드를 생성해주세요')
    return
  }

  const link = document.createElement('a')
  link.href = qrCodeDataUrl.value
  link.download = `qrcode-${Date.now()}.png`
  link.click()
  showToast('QR 코드가 다운로드되었습니다')
}

const handleCopyImage = async () => {
  if (!qrCodeDataUrl.value) {
    showToast('먼저 QR 코드를 생성해주세요')
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
    showToast('QR 코드가 복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

useHead({
  title: 'QR코드 생성기 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        '텍스트나 URL을 QR 코드로 변환할 수 있는 QR 코드 생성기입니다. 다양한 크기와 오류 복구 레벨로 QR 코드를 생성하고 다운로드하세요.',
    },
    {
      name: 'keywords',
      content: 'QR코드생성기, QR생성, 큐알코드만들기, URL QR코드, 텍스트 QR코드',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'QR코드 생성기 - 무설치 유팉리티' },
    { property: 'og:description', content: '텍스트나 URL을 QR 코드로 변환' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'QR코드 생성기 - 무설치 유팉리티' },
    { name: 'twitter:description', content: '텍스트나 URL을 QR 코드로 변환' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'QR코드 생성기',
        description: '텍스트나 URL을 QR 코드로 변환할 수 있는 도구',
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
      <h1 class="header-title">QR코드 생성기</h1>
      <p class="header-description">텍스트나 URL을 입력하면 QR 코드로 변환됩니다</p>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Input Section -->
      <div class="input-section">
        <div class="card">
          <div class="form-group">
            <label class="label">텍스트 또는 URL</label>
            <textarea
              v-model="text"
              class="textarea"
              placeholder="QR 코드로 변환할 텍스트나 URL을 입력하세요..."
              rows="4"
            />
          </div>

          <div class="form-group">
            <label class="label"> 크기: {{ qrSize }}px </label>
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
            <label class="label">오류 복구 수준</label>
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
              초기화
            </button>
          </div>
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="qr-section">
        <div class="card qr-card">
          <div v-if="!qrCodeDataUrl" class="qr-placeholder">
            <Icon name="mdi:qrcode" />
            <p>텍스트를 입력하면<br />QR 코드가 생성됩니다</p>
          </div>

          <div v-else class="qr-display">
            <div v-if="isGenerating" class="qr-loading">
              <div class="spinner" />
              <p>생성 중...</p>
            </div>
            <img v-else :src="qrCodeDataUrl" alt="QR Code" class="qr-image" />
          </div>

          <div v-if="qrCodeDataUrl" class="qr-actions">
            <button class="btn btn-primary" @click="handleDownload">
              <Icon name="mdi:download" />
              다운로드
            </button>
            <button class="btn btn-primary" @click="handleCopyImage">
              <Icon name="mdi:content-copy" />
              복사
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="card info-section">
      <h2 class="info-title">
        <Icon name="mdi:information" />
        사용 안내
      </h2>
      <ul class="info-list">
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>URL, 텍스트, 전화번호 등 다양한 정보를 QR 코드로 변환할 수 있습니다</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>오류 복구 수준이 높을수록 QR 코드가 손상되어도 읽을 수 있습니다</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>크기를 조절하여 용도에 맞는 QR 코드를 생성할 수 있습니다</span>
        </li>
        <li class="info-item">
          <Icon name="mdi:check-circle" />
          <span>생성된 QR 코드는 PNG 이미지로 다운로드할 수 있습니다</span>
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
