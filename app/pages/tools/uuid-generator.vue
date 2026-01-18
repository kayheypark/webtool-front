<script setup lang="ts">
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
    showToast('복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(uuids.value.join('\n'))
    showToast('모두 복사되었습니다')
  } catch (error) {
    console.error('복사 실패:', error)
    showToast('복사에 실패했습니다')
  }
}

onMounted(() => {
  handleGenerate()
})

useHead({
  title: 'UUID 생성기 - 무설치 유팉리티',
  meta: [
    {
      name: 'description',
      content:
        'UUID(Universally Unique Identifier)를 생성하는 도구입니다. UUID v4 형식으로 고유한 식별자를 생성하고 복사할 수 있습니다.',
    },
    { name: 'keywords', content: 'UUID생성기, GUID생성기, 고유식별자, UUID생성, 랜덤UUID' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'UUID 생성기 - 무설치 유팉리티' },
    { property: 'og:description', content: 'UUID v4 형식으로 고유한 식별자를 생성' },
    { property: 'og:site_name', content: '무설치 유틸리티' },
    { property: 'og:locale', content: 'ko_KR' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'UUID 생성기 - 무설치 유팉리티' },
    { name: 'twitter:description', content: 'UUID v4 형식으로 고유한 식별자를 생성' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'UUID 생성기',
        description: 'UUID(Universally Unique Identifier)를 생성하는 도구',
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
      <h1 class="header-title">UUID 생성기</h1>
      <p class="header-description">고유한 UUID를 생성하세요</p>
    </div>

    <div class="content">
      <div class="card control-card">
        <div class="control-group">
          <label class="control-label">생성 개수</label>
          <input v-model.number="count" type="number" min="1" max="100" class="control-input" />
        </div>
        <div class="button-group">
          <button class="btn btn-primary" @click="handleGenerate">
            <Icon name="mdi:refresh" />
            생성
          </button>
          <button v-if="uuids.length > 0" class="btn btn-secondary" @click="copyAll">
            <Icon name="mdi:content-copy" />
            모두 복사
          </button>
        </div>
      </div>

      <div v-if="uuids.length > 0" class="uuid-list">
        <div v-for="(uuid, index) in uuids" :key="index" class="uuid-item card">
          <code class="uuid-code">{{ uuid }}</code>
          <button class="btn-copy-small" @click="copyToClipboard(uuid)">
            <Icon name="mdi:content-copy" />
          </button>
        </div>
      </div>

      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          UUID란?
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>UUID는 범용 고유 식별자로, 중복 가능성이 거의 없는 고유한 ID입니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>Version 4 UUID를 생성하며, 무작위로 생성됩니다</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>데이터베이스 ID, 파일명, 세션 ID 등에 사용됩니다</span>
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

.control-card {
  display: flex;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.control-group {
  flex: 1;
}

.control-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
  margin-bottom: 8px;
}

.control-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--fe-border-light);
  border-radius: 8px;
  font-size: 15px;
  color: var(--fe-gray-700);
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--fe-primary);
  }
}

.uuid-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uuid-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.uuid-code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  color: var(--fe-primary);
  background: var(--fe-gray-50);
  padding: 8px 12px;
  border-radius: 6px;
  word-break: break-all;
}

.btn-copy-small {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--fe-gray-50);
  border: none;
  border-radius: 8px;
  color: var(--fe-gray-600);
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--fe-primary);
    color: white;
  }
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
}
</style>
