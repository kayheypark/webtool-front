<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: '데이터가 없습니다.',
})
</script>

<template>
  <p class="fe-no-data">{{ message }}</p>
</template>

<style scoped>
.fe-no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888888;
  height: -webkit-fill-available;
}
</style>
