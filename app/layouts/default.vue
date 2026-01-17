<script setup lang="ts">
import AppBar from '~/components/appbar/index.vue'
import type { AppBarStyle } from '~~/shared/types/appBar'

const config = useRuntimeConfig()
const route = useRoute()
const { isIframe, isFullpage } = useIframe()
const { dynamicTitle } = useAppBar()

// 페이지 config
const pageConfig = computed(() => {
  const appBarStyle = route.meta.appBarStyle as AppBarStyle | undefined
  return {
    title: dynamicTitle.value || (route.meta.title as string),
    showAppBar: route.meta.showAppBar as boolean,
    appBarStyle,
  }
})

// iframe 상태가 계산되기 전(null) → 깜빡임 방지 위해 숨김
const loading = computed(() => isIframe.value === null || isFullpage.value === null)

// 뷰 타입 계산
const normalView = computed(() => !isIframe.value && !isFullpage.value)
const fullpageView = computed(() => isFullpage.value)
const appBarCondition = computed(
  () => !loading.value && pageConfig.value.showAppBar && (normalView.value || fullpageView.value),
)

const showBackButton = computed(() => {
  return pageConfig.value.appBarStyle?.showBackButton ?? true
})

const showMypageButton = computed(() => {
  return pageConfig.value.appBarStyle?.showMypageButton ?? true
})
</script>

<template>
  <div class="fe-wrap">
    <div v-if="config.public.nodeEnv !== 'production'" class="fe-debug-env">
      {{ config.public.nodeEnv }}
    </div>
    <div class="fe-layout-wrap theme-default">
      <div id="Wrap" class="fe-layout-container">
        <AppBar
          v-if="appBarCondition"
          :title="pageConfig.title"
          :show-close-button="!loading && !!fullpageView"
          :show-back-button="showBackButton"
          :show-mypage-button="showMypageButton"
        />
        <div class="fe-page-content" :class="{ hidden: loading }">
          <slot />
        </div>
      </div>
      <CommonModal />
      <CommonBottomSheet />
    </div>
  </div>
</template>

<style scoped>
.fe-debug-env {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background-color: #e53935;
  border-radius: 0 0 4px 0;
  opacity: 0.8;
}
</style>
