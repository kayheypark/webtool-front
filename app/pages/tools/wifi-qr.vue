<script setup lang="ts">
import QRCode from 'qrcode'

const { t } = useI18n()
const { showToast } = useToast()

// WiFi 정보
const ssid = ref('')
const password = ref('')
const securityType = ref<'WPA' | 'WEP' | 'nopass'>('WPA')
const isHidden = ref(false)

// QR 코드
const qrCodeUrl = ref('')
const showQR = ref(false)

// WiFi QR 코드 형식: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
const generateWiFiString = () => {
  if (!ssid.value) {
    showToast(t('tools.wifiQr.invalidSsid'))
    return null
  }

  if (securityType.value !== 'nopass' && !password.value) {
    showToast(t('tools.wifiQr.invalidPassword'))
    return null
  }

  const escapeSpecialChars = (str: string) => {
    return str.replace(/([\\";,:])/g, '\\$1')
  }

  const security = securityType.value === 'nopass' ? 'nopass' : securityType.value
  const escapedSSID = escapeSpecialChars(ssid.value)
  const escapedPassword = securityType.value !== 'nopass' ? escapeSpecialChars(password.value) : ''
  const hidden = isHidden.value ? 'true' : 'false'

  return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};H:${hidden};;`
}

const generateQRCode = async () => {
  const wifiString = generateWiFiString()
  if (!wifiString) return

  try {
    qrCodeUrl.value = await QRCode.toDataURL(wifiString, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    showQR.value = true
    showToast(t('tools.wifiQr.generateSuccess'))
  } catch (error) {
    console.error('QR code generation failed:', error)
    showToast(t('tools.wifiQr.generateFailed'))
  }
}

const downloadQRCode = () => {
  if (!qrCodeUrl.value) return

  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = `wifi-${ssid.value || 'qrcode'}.png`
  link.click()
  showToast(t('common.downloaded'))
}

const copyToClipboard = async () => {
  if (!qrCodeUrl.value) return

  try {
    const response = await fetch(qrCodeUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    showToast(t('common.copied'))
  } catch (error) {
    console.error('Copy failed:', error)
    showToast(t('common.copyFailed'))
  }
}

const reset = () => {
  ssid.value = ''
  password.value = ''
  securityType.value = 'WPA'
  isHidden.value = false
  qrCodeUrl.value = ''
  showQR.value = false
}

useHead({
  title: `${t('tools.wifiQr.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.wifiQr.metaDescription'),
    },
    {
      name: 'keywords',
      content: 'WiFi QR code, WiFi sharing, QR generator, network sharing, WiFi auto connect',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: `${t('tools.wifiQr.title')} - ${t('common.title')}` },
    {
      property: 'og:description',
      content: t('tools.wifiQr.description'),
    },
    { property: 'og:site_name', content: t('common.title') },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${t('tools.wifiQr.title')} - ${t('common.title')}` },
    {
      name: 'twitter:description',
      content: t('tools.wifiQr.description'),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('tools.wifiQr.title'),
        description: t('tools.wifiQr.description'),
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
      <h1 class="header-title">{{ $t('tools.wifiQr.title') }}</h1>
      <p class="header-description">{{ $t('tools.wifiQr.description') }}</p>
    </div>

    <div class="content">
      <!-- WiFi 정보 입력 -->
      <div class="card input-section">
        <h2 class="section-title">
          <Icon name="mdi:wifi" />
          {{ $t('tools.wifiQr.wifiInfoTitle') }}
        </h2>

        <div class="form-group">
          <label for="ssid" class="form-label">
            {{ $t('tools.wifiQr.networkName') }}
            <span class="required">*</span>
          </label>
          <input
            id="ssid"
            v-model="ssid"
            type="text"
            class="form-input"
            :placeholder="$t('tools.wifiQr.networkNamePlaceholder')"
            maxlength="32"
          />
        </div>

        <div class="form-group">
          <label for="security" class="form-label">{{ $t('tools.wifiQr.securityType') }}</label>
          <select id="security" v-model="securityType" class="form-select">
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">{{ $t('tools.wifiQr.noSecurity') }}</option>
          </select>
        </div>

        <div v-if="securityType !== 'nopass'" class="form-group">
          <label for="password" class="form-label">
            {{ $t('tools.wifiQr.password') }}
            <span class="required">*</span>
          </label>
          <input
            id="password"
            v-model="password"
            type="text"
            class="form-input"
            :placeholder="$t('tools.wifiQr.passwordPlaceholder')"
            maxlength="63"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="isHidden" type="checkbox" class="form-checkbox" />
            <span>{{ $t('tools.wifiQr.hidden') }}</span>
          </label>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="generateQRCode">
            <Icon name="mdi:qrcode" />
            {{ $t('tools.wifiQr.generateQR') }}
          </button>
          <button class="btn btn-secondary" @click="reset">
            <Icon name="mdi:refresh" />
            {{ $t('common.reset') }}
          </button>
        </div>
      </div>

      <!-- QR 코드 결과 -->
      <div v-if="showQR" class="card qr-section">
        <h2 class="section-title">
          <Icon name="mdi:qrcode-scan" />
          {{ $t('tools.wifiQr.generatedQR') }}
        </h2>

        <div class="qr-container">
          <img :src="qrCodeUrl" alt="WiFi QR Code" class="qr-image" />
        </div>

        <div class="qr-info">
          <div class="info-row">
            <span class="info-label">{{ $t('tools.wifiQr.network') }}:</span>
            <span class="info-value">{{ ssid }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('tools.wifiQr.security') }}:</span>
            <span class="info-value">{{
              securityType === 'nopass' ? $t('tools.wifiQr.noSecurity') : securityType
            }}</span>
          </div>
          <div v-if="isHidden" class="info-row">
            <span class="info-label">{{ $t('tools.wifiQr.status') }}:</span>
            <span class="info-value">{{ $t('tools.wifiQr.hiddenNetwork') }}</span>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="downloadQRCode">
            <Icon name="mdi:download" />
            {{ $t('common.download') }}
          </button>
          <button class="btn btn-secondary" @click="copyToClipboard">
            <Icon name="mdi:content-copy" />
            {{ $t('common.copy') }}
          </button>
        </div>
      </div>

      <!-- 안내사항 -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          {{ $t('tools.wifiQr.info.title') }}
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.wifiQr.info.item1') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.wifiQr.info.item2') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.wifiQr.info.item3') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.wifiQr.info.item4') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.wifiQr.info.item5') }}</span>
          </li>
        </ul>
      </div>
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

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section,
.qr-section {
  padding: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin: 0 0 24px;

  :deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--fe-primary);
  }
}

.form-group {
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--fe-gray-300);
  border-radius: 8px;
  font-size: 15px;
  color: var(--fe-gray-700);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--fe-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: var(--fe-gray-400);
  }
}

.form-select {
  cursor: pointer;
  background-color: white;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  span {
    font-size: 14px;
    color: var(--fe-gray-700);
  }
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--fe-primary);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: translateY(1px);
  }
}

.btn-primary {
  background: var(--fe-primary);
  color: white;

  &:hover {
    background: var(--fe-primary-hover);
    box-shadow: var(--fe-shadow-md);
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background: var(--fe-gray-100);
  color: var(--fe-gray-700);

  &:hover {
    background: var(--fe-gray-200);
    box-shadow: var(--fe-shadow-sm);
    transform: translateY(-2px);
  }
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: var(--fe-gray-50);
  border-radius: 12px;
  margin-bottom: 24px;
}

.qr-image {
  max-width: 100%;
  width: 320px;
  height: auto;
  border-radius: 8px;
  background: white;
  padding: 16px;
}

.qr-info {
  background: var(--fe-gray-50);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--fe-gray-200);
  }
}

.info-label {
  font-size: 14px;
  color: var(--fe-gray-500);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: var(--fe-gray-700);
  font-weight: 600;
  word-break: break-all;
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
  .button-group {
    flex-direction: column;
  }

  .qr-image {
    width: 240px;
  }
}
</style>