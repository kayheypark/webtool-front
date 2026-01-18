<script setup lang="ts">
const { showToast } = useToast()
const { t } = useI18n()
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

const handleShare = async () => {
  const shareData = {
    title: document.title,
    url: shareUrl.value,
  }

  // Web Share API 지원 여부 확인
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        // 사용자가 취소한 경우가 아니면 URL 복사로 폴백
        await copyUrl()
      }
    }
  } else {
    // Web Share API 미지원 시 URL 복사
    await copyUrl()
  }
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    showToast(t('common.urlCopied'))
  } catch (error) {
    console.error('복사 실패:', error)
    showToast(t('common.copyFailed'))
  }
}
</script>

<template>
  <button class="share-button" @click="handleShare">
    <Icon name="mdi:share-variant" />
    <span>{{ $t('common.share') }}</span>
  </button>
</template>

<style scoped lang="scss">
.share-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--fe-gray-600);
  cursor: pointer;
  transition: all 0.3s ease;

  :deep(svg) {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: var(--fe-gray-50);
    border-color: var(--fe-primary);
    color: var(--fe-primary);
  }

  &:active {
    transform: translateY(1px);
  }
}
</style>
