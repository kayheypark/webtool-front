<script setup lang="ts">
import QRCode from 'qrcode'

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
    showToast('네트워크 이름(SSID)을 입력하세요')
    return null
  }

  if (securityType.value !== 'nopass' && !password.value) {
    showToast('비밀번호를 입력하세요')
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
    showToast('QR 코드가 생성되었습니다')
  } catch (error) {
    console.error('QR 코드 생성 실패:', error)
    showToast('QR 코드 생성에 실패했습니다')
  }
}

const downloadQRCode = () => {
  if (!qrCodeUrl.value) return

  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = `wifi-${ssid.value || 'qrcode'}.png`
  link.click()
  showToast('다운로드되었습니다')
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
    showToast('클립보드에 복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
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
  title: 'WiFi QR 코드 생성기 - 무설치 유틸리티',
  meta: [
    {
      name: 'description',
      content:
        'WiFi 네트워크 정보를 QR 코드로 변환하여 간편하게 공유하세요. 스마트폰으로 QR 코드를 스캔하면 자동으로 WiFi에 연결됩니다.',
    },
    {
      name: 'keywords',
      content: 'WiFi QR코드, 와이파이 공유, QR코드 생성기, 네트워크 공유, WiFi 자동연결',
    },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'WiFi QR 코드 생성기 - 무설치 유틸리티' },
    {
      property: 'og:description',
      content: 'WiFi 네트워크 정보를 QR 코드로 변환하여 간편하게 공유',
    },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'WiFi QR 코드 생성기 - 무설치 유틸리티' },
    {
      name: 'twitter:description',
      content: 'WiFi 네트워크 정보를 QR 코드로 변환하여 간편하게 공유',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'WiFi QR 코드 생성기',
        description: 'WiFi 네트워크 정보를 QR 코드로 변환하는 도구',
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
      <h1 class="header-title">WiFi QR 코드 생성기</h1>
      <p class="header-description">WiFi 네트워크 정보를 QR 코드로 변환하여 간편하게 공유하세요</p>
    </div>

    <div class="content">
      <!-- WiFi 정보 입력 -->
      <div class="card input-section">
        <h2 class="section-title">
          <Icon name="mdi:wifi" />
          WiFi 정보 입력
        </h2>

        <div class="form-group">
          <label for="ssid" class="form-label">
            네트워크 이름 (SSID)
            <span class="required">*</span>
          </label>
          <input
            id="ssid"
            v-model="ssid"
            type="text"
            class="form-input"
            placeholder="예: MyWiFi"
            maxlength="32"
          />
        </div>

        <div class="form-group">
          <label for="security" class="form-label">보안 방식</label>
          <select id="security" v-model="securityType" class="form-select">
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">보안 없음</option>
          </select>
        </div>

        <div v-if="securityType !== 'nopass'" class="form-group">
          <label for="password" class="form-label">
            비밀번호
            <span class="required">*</span>
          </label>
          <input
            id="password"
            v-model="password"
            type="text"
            class="form-input"
            placeholder="WiFi 비밀번호 입력"
            maxlength="63"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="isHidden" type="checkbox" class="form-checkbox" />
            <span>숨겨진 네트워크</span>
          </label>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="generateQRCode">
            <Icon name="mdi:qrcode" />
            QR 코드 생성
          </button>
          <button class="btn btn-secondary" @click="reset">
            <Icon name="mdi:refresh" />
            초기화
          </button>
        </div>
      </div>

      <!-- QR 코드 결과 -->
      <div v-if="showQR" class="card qr-section">
        <h2 class="section-title">
          <Icon name="mdi:qrcode-scan" />
          생성된 QR 코드
        </h2>

        <div class="qr-container">
          <img :src="qrCodeUrl" alt="WiFi QR Code" class="qr-image" />
        </div>

        <div class="qr-info">
          <div class="info-row">
            <span class="info-label">네트워크:</span>
            <span class="info-value">{{ ssid }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">보안:</span>
            <span class="info-value">{{
              securityType === 'nopass' ? '보안 없음' : securityType
            }}</span>
          </div>
          <div v-if="isHidden" class="info-row">
            <span class="info-label">상태:</span>
            <span class="info-value">숨겨진 네트워크</span>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="downloadQRCode">
            <Icon name="mdi:download" />
            다운로드
          </button>
          <button class="btn btn-secondary" @click="copyToClipboard">
            <Icon name="mdi:content-copy" />
            복사
          </button>
        </div>
      </div>

      <!-- 안내사항 -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          사용 방법
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>WiFi 네트워크 이름(SSID)과 비밀번호를 입력하세요</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>QR 코드 생성 버튼을 클릭하여 QR 코드를 만드세요</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>스마트폰 카메라로 QR 코드를 스캔하면 자동으로 WiFi에 연결됩니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>일부 오래된 기기에서는 WiFi QR 코드가 지원되지 않을 수 있습니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>보안을 위해 생성된 QR 코드는 신뢰할 수 있는 사람과만 공유하세요</span>
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
