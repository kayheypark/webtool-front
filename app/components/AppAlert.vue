<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="app-alert">
    <strong class="app-alert-title">⚠️ {{ title }}</strong>
    <span class="app-alert-message">{{ message }}</span>
  </div>
</template>

<style scoped>
.app-alert {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
}
</style>
