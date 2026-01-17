<script setup lang="ts">
const { modalList, close } = useModal()
const { t } = useI18n()

const hasModal = computed(() => modalList.length > 0)
</script>

<template>
  <div v-if="hasModal" class="mdBox on fe-md-box">
    <!-- 모달 내용들 -->
    <div v-for="modal in modalList" :key="modal.id" class="mditem alert">
      <div class="conBox">
        <div class="md-con">
          <p>{{ modal.message }}</p>
        </div>
      </div>
      <div class="btnBox type-ct">
        <template v-if="modal.type === 'confirm'">
          <button type="button" class="btn-bu btn-close" @click="close(modal.id, false)">
            {{ t('common.cancel') }}
          </button>
          <button type="button" class="btn-bu btn-close" @click="close(modal.id, true)">
            {{ t('common.confirm') }}
          </button>
        </template>
        <template v-else>
          <button type="button" class="btn-bu btn-close" @click="close(modal.id, true)">
            {{ t('common.confirm') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fe-md-box {
  z-index: 10;
}
</style>
