<script setup lang="ts">
const ipInfoStore = useIPInfoStore()
const { showToast } = useToast()

const loading = ref(true)
const error = ref<string | null>(null)

const ipInfo = computed(() => ipInfoStore.ipInfo)

const fetchIPInfo = async (force = false) => {
  loading.value = true
  error.value = null

  try {
    await ipInfoStore.fetchIPInfo(force)
  } catch (err) {
    console.error('IP 정보 조회 실패:', err)
    error.value = 'IP 정보를 가져오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

onMounted(() => {
  fetchIPInfo()
})

useHead({
  title: '내 IP 주소 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        '현재 사용 중인 IP 주소와 위치 정보를 확인할 수 있습니다. 국가, 지역, 도시, ISP 정보를 실시간으로 조회하세요.',
    },
    { name: 'keywords', content: '내아이피, IP주소확인, IP조회, 위치정보, ISP확인, 아이피주소' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: '내 IP 주소 - 무설치 유팉리티' },
    { property: 'og:description', content: '현재 사용 중인 IP 주소와 위치 정보를 확인' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: '내 IP 주소 - 무설치 유팉리티' },
    { name: 'twitter:description', content: '현재 사용 중인 IP 주소와 위치 정보를 확인' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '내 IP 주소',
        description: '현재 사용 중인 IP 주소와 위치 정보를 확인할 수 있는 도구',
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
      <h1 class="header-title">{{ $t('tools.myIp.title') }}</h1>
      <p class="header-description">{{ $t('tools.myIp.description') }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner" />
      <p class="loading-text">{{ $t('common.loading') }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card error-card">
      <Icon name="mdi:alert-circle" class="error-icon" />
      <p class="error-text">{{ error }}</p>
      <button class="btn btn-primary" @click="() => fetchIPInfo(true)">
        <Icon name="mdi:refresh" />
        {{ $t('common.retry') }}
      </button>
    </div>

    <!-- IP Info -->
    <div v-else-if="ipInfo" class="content">
      <!-- Main IP Card -->
      <div class="ip-card">
        <div class="ip-label">{{ $t('tools.myIp.yourIp') }}</div>
        <div class="ip-value">{{ ipInfo.ip }}</div>
        <button class="btn btn-copy" @click="copyToClipboard(ipInfo.ip)">
          <Icon name="mdi:content-copy" />
          {{ $t('common.copy') }}
        </button>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">
        <div class="card detail-card">
          <div class="detail-icon">
            <Icon name="mdi:earth" />
          </div>
          <div class="detail-info">
            <div class="detail-label">{{ $t('tools.myIp.country') }}</div>
            <div class="detail-value">{{ ipInfo.country || '-' }}</div>
          </div>
        </div>

        <div class="card detail-card">
          <div class="detail-icon">
            <Icon name="mdi:map-marker" />
          </div>
          <div class="detail-info">
            <div class="detail-label">{{ $t('tools.myIp.region') }}</div>
            <div class="detail-value">{{ ipInfo.region || '-' }}</div>
          </div>
        </div>

        <div class="card detail-card">
          <div class="detail-icon">
            <Icon name="mdi:city" />
          </div>
          <div class="detail-info">
            <div class="detail-label">{{ $t('tools.myIp.city') }}</div>
            <div class="detail-value">{{ ipInfo.city || '-' }}</div>
          </div>
        </div>

        <div class="card detail-card">
          <div class="detail-icon">
            <Icon name="mdi:server-network" />
          </div>
          <div class="detail-info">
            <div class="detail-label">ISP</div>
            <div class="detail-value">{{ ipInfo.isp || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          {{ $t('tools.myIp.info.title') }}
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.myIp.info.item1') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.myIp.info.item2') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.myIp.info.item3') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.myIp.info.item4') }}</span>
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

.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--fe-gray-200);
  border-top-color: var(--fe-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: var(--fe-gray-500);
  margin: 0;
}

.error-card {
  text-align: center;
  padding: 48px 24px;

  .error-icon {
    width: 48px;
    height: 48px;
    color: #ef4444;
    margin-bottom: 16px;
  }

  .error-text {
    font-size: 16px;
    color: var(--fe-gray-600);
    margin: 0 0 24px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ip-card {
  background: var(--fe-primary);
  color: white;
  padding: 48px 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: var(--fe-shadow-lg);
}

.ip-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 12px;
}

.ip-value {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  word-break: break-all;
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: white;
  color: var(--fe-primary);
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.detail-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--fe-gray-50);
  border-radius: 12px;

  :deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--fe-primary);
  }
}

.detail-info {
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 12px;
  color: var(--fe-gray-500);
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--fe-gray-700);
  word-break: break-word;
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

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
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

@media (max-width: 768px) {
  .ip-value {
    font-size: 32px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
