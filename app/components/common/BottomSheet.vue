<script setup lang="ts">
const { sheetList, hasSheet, close, closeTop } = useBottomSheet()

const isMouseDownOnBackdrop = ref(false)

const handleMouseDown = (e: MouseEvent) => {
  isMouseDownOnBackdrop.value = e.target === e.currentTarget
}

const handleMouseUp = (e: MouseEvent) => {
  if (isMouseDownOnBackdrop.value && e.target === e.currentTarget) {
    closeTop()
  }
  isMouseDownOnBackdrop.value = false
}
</script>

<template>
  <div v-if="hasSheet" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
    <div
      v-for="sheet in sheetList"
      :key="sheet.id"
      class="fe-bottom-sheet"
      :style="{ height: `${sheet.height}px` }"
    >
      <CommonBottomsheetCommentContent
        v-if="sheet.type === 'comment'"
        :total-count="Number(sheet.props?.totalCount ?? 0)"
        :record-id="String(sheet.props?.recordId ?? 0)"
        @close="close(sheet.id)"
      />
      <CommonBottomsheetLikeContent
        v-if="sheet.type === 'like'"
        :total-count="Number(sheet.props?.totalCount ?? 0)"
        :record-id="String(sheet.props?.recordId ?? 0)"
        @close="close(sheet.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.fe-bottom-sheet {
  max-height: 100vh;
}
</style>
