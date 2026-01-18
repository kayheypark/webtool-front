<script setup lang="ts">
const { toastMessage, showToastState } = useToast()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="showToastState" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 32px;
  background: var(--fe-gray-700);
  color: white;
  border-radius: 8px;
  box-shadow: var(--fe-shadow-xl);
  font-size: 15px;
  font-weight: 500;
  z-index: 10000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
