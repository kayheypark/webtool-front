<script setup lang="ts">
const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<template>
  <button class="back-button" @click="handleBack">
    <Icon name="mdi:arrow-left" />
    <span>{{ $t('common.back') }}</span>
  </button>
</template>

<style scoped lang="scss">
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--fe-border-light);
  border-radius: 8px;
  color: var(--fe-gray-600);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--fe-gray-50);
    border-color: var(--fe-gray-300);
    color: var(--fe-gray-700);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
}
</style>
