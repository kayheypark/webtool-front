<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showToast } = useToast()
const { t } = useI18n()

// 디바이스 감지
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')

// Canvas refs
const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)

// 그리기 상태
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// 그리기 히스토리 (undo/redo)
const history = ref<ImageData[]>([])
const historyStep = ref(-1)

// 설정 값들
const backgroundColor = ref<'white' | 'black' | 'transparent'>('white')
const penColor = ref('#000000')
const penWidth = ref(4)
const fileFormat = ref<'png' | 'jpg'>('png')

// 프리셋 펜 두께
const penWidthPresets = computed(() => [
  { label: t('tools.signatureGenerator.thin'), value: 2 },
  { label: t('tools.signatureGenerator.normal'), value: 4 },
  { label: t('tools.signatureGenerator.thick'), value: 6 },
  { label: t('tools.signatureGenerator.veryThick'), value: 8 },
])

// 배경색 옵션
const backgroundOptions = computed(() => [
  { label: t('tools.signatureGenerator.white'), value: 'white', color: '#ffffff' },
  { label: t('tools.signatureGenerator.black'), value: 'black', color: '#000000' },
  { label: t('tools.signatureGenerator.transparent'), value: 'transparent', color: 'transparent' },
])

// 펜 색상 프리셋
const penColorPresets = computed(() => [
  { label: t('tools.signatureGenerator.black'), value: '#000000' },
  { label: t('tools.signatureGenerator.blue'), value: '#0000FF' },
  { label: t('tools.signatureGenerator.red'), value: '#FF0000' },
])

// Canvas 크기 계산
const canvasSize = computed(() => {
  if (!import.meta.client) return { width: 800, height: 400 }

  if (isMobile.value) {
    const maxWidth = window.innerWidth - 40
    return { width: Math.min(maxWidth, 400), height: 300 }
  }
  if (isTablet.value) {
    return { width: 600, height: 350 }
  }
  return { width: 800, height: 400 }
})

// Canvas 초기화
const initCanvas = () => {
  if (!canvas.value) return

  ctx.value = canvas.value.getContext('2d')
  if (!ctx.value) return

  // 배경색 설정
  applyBackground()

  // 펜 설정
  ctx.value.strokeStyle = penColor.value
  ctx.value.lineWidth = penWidth.value
  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'

  // 초기 상태 저장
  saveToHistory()
}

// 배경색 적용
const applyBackground = () => {
  if (!ctx.value || !canvas.value) return

  ctx.value.save()

  if (backgroundColor.value === 'transparent') {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  } else {
    ctx.value.fillStyle = backgroundColor.value === 'white' ? '#ffffff' : '#000000'
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
  }

  ctx.value.restore()
}

// 그리기 시작
const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (!ctx.value) return

  isDrawing.value = true
  const point = getPoint(e)
  lastX.value = point.x
  lastY.value = point.y

  ctx.value.beginPath()
  ctx.value.moveTo(point.x, point.y)
}

// 그리기
const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx.value) return

  e.preventDefault()
  const point = getPoint(e)

  ctx.value.lineTo(point.x, point.y)
  ctx.value.stroke()

  lastX.value = point.x
  lastY.value = point.y
}

// 그리기 종료
const endDrawing = () => {
  if (!isDrawing.value) return

  isDrawing.value = false
  saveToHistory()
}

// 좌표 가져오기 (마우스/터치 통합)
const getPoint = (e: MouseEvent | TouchEvent) => {
  if (!canvas.value) return { x: 0, y: 0 }

  const rect = canvas.value.getBoundingClientRect()

  if ('touches' in e && e.touches.length > 0) {
    return {
      x: (e.touches[0]?.clientX ?? 0) - rect.left,
      y: (e.touches[0]?.clientY ?? 0) - rect.top,
    }
  } else if ('clientX' in e) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  return { x: 0, y: 0 }
}

// 히스토리 저장
const saveToHistory = () => {
  if (!ctx.value || !canvas.value) return

  historyStep.value++
  if (historyStep.value < history.value.length) {
    history.value.splice(historyStep.value)
  }

  history.value.push(ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height))

  // 최대 50개 히스토리 유지
  if (history.value.length > 50) {
    history.value.shift()
    historyStep.value--
  }
}

// 실행 취소
const undo = () => {
  if (historyStep.value <= 0) return

  historyStep.value--
  const imageData = history.value[historyStep.value]
  if (imageData) {
    ctx.value?.putImageData(imageData, 0, 0)
  }
}

// 다시 실행
const redo = () => {
  if (historyStep.value >= history.value.length - 1) return

  historyStep.value++
  const imageData = history.value[historyStep.value]
  if (imageData) {
    ctx.value?.putImageData(imageData, 0, 0)
  }
}

// 전체 지우기
const clearCanvas = () => {
  if (!ctx.value || !canvas.value) return

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  applyBackground()
  saveToHistory()
}

// 배경색 변경
const changeBackground = (color: 'white' | 'black' | 'transparent') => {
  backgroundColor.value = color

  // 현재 그림 저장
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!canvas.value || !ctx.value || !tempCtx) return

  tempCanvas.width = canvas.value.width
  tempCanvas.height = canvas.value.height
  tempCtx.drawImage(canvas.value, 0, 0)

  // 배경 적용
  applyBackground()

  // 그림 복원
  ctx.value.drawImage(tempCanvas, 0, 0)
  saveToHistory()
}

// 펜 색상 변경
const changePenColor = (color: string) => {
  penColor.value = color
  if (ctx.value) {
    ctx.value.strokeStyle = color
  }
}

// 펜 두께 변경
const changePenWidth = (width: number) => {
  penWidth.value = width
  if (ctx.value) {
    ctx.value.lineWidth = width
  }
}

// 다운로드
const download = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)

  if (fileFormat.value === 'jpg') {
    // JPG는 투명 배경 지원 안함, 흰색 배경으로 변환
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCanvas.width = canvas.value.width
    tempCanvas.height = canvas.value.height

    // 흰색 배경
    tempCtx.fillStyle = '#ffffff'
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // 서명 그리기
    tempCtx.drawImage(canvas.value, 0, 0)

    link.download = `signature_${timestamp}.jpg`
    link.href = tempCanvas.toDataURL('image/jpeg', 0.9)
  } else {
    link.download = `signature_${timestamp}.png`
    link.href = canvas.value.toDataURL('image/png')
  }

  link.click()
  showToast(t('tools.signatureGenerator.downloadSuccess'))
}

// 클립보드 복사
const copyToClipboard = async () => {
  if (!canvas.value) return

  try {
    canvas.value.toBlob(async (blob) => {
      if (!blob) return

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ])

      showToast(t('common.copied'))
    })
  } catch (error) {
    console.error('복사 실패:', error)
    showToast(t('tools.signatureGenerator.copyError'))
  }
}

onMounted(() => {
  initCanvas()

  // 터치 스크롤 방지
  if (canvas.value) {
    canvas.value.addEventListener(
      'touchmove',
      (e) => {
        if (isDrawing.value) {
          e.preventDefault()
        }
      },
      { passive: false },
    )
  }
})

// SEO
useHead({
  title: `${t('tools.signatureGenerator.title')} - ${t('common.title')}`,
  meta: [
    {
      name: 'description',
      content: t('tools.signatureGenerator.description'),
    },
    {
      name: 'keywords',
      content:
        'signature generator, digital signature, sign creator, canvas drawing, online signature',
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
      <h1 class="header-title">{{ $t('tools.signatureGenerator.title') }}</h1>
      <p class="header-description">{{ $t('tools.signatureGenerator.description') }}</p>
    </div>

    <div class="signature-container">
      <!-- 도구 모음 (PC: 상단, 모바일: 하단) -->
      <div class="toolbar" :class="{ mobile: isMobile }">
        <!-- 배경색 선택 -->
        <div class="tool-group">
          <label class="tool-label">{{ $t('tools.signatureGenerator.background') }}</label>
          <div class="button-group">
            <button
              v-for="bg in backgroundOptions"
              :key="bg.value"
              class="tool-button"
              :class="{ active: backgroundColor === bg.value }"
              @click="changeBackground(bg.value as 'white' | 'black' | 'transparent')"
            >
              <span
                class="color-preview"
                :style="{
                  background:
                    bg.color === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)'
                      : bg.color,
                  backgroundSize: bg.color === 'transparent' ? '10px 10px' : 'auto',
                  backgroundPosition: bg.color === 'transparent' ? '0 0, 5px 5px' : 'center',
                }"
              />
              <span v-if="!isMobile" class="tool-text">{{ bg.label }}</span>
            </button>
          </div>
        </div>

        <!-- 펜 색상 -->
        <div class="tool-group">
          <label class="tool-label">{{ $t('tools.signatureGenerator.penColor') }}</label>
          <div class="button-group">
            <button
              v-for="color in penColorPresets"
              :key="color.value"
              class="tool-button"
              :class="{ active: penColor === color.value }"
              @click="changePenColor(color.value)"
            >
              <span class="color-preview" :style="{ background: color.value }" />
              <span v-if="!isMobile" class="tool-text">{{ color.label }}</span>
            </button>
            <input
              type="color"
              :value="penColor"
              class="color-picker"
              @change="changePenColor(penColor)"
            />
          </div>
        </div>

        <!-- 펜 두께 -->
        <div class="tool-group">
          <label class="tool-label">{{ $t('tools.signatureGenerator.penWidth') }}</label>
          <div class="button-group">
            <button
              v-for="width in penWidthPresets"
              :key="width.value"
              class="tool-button"
              :class="{ active: penWidth === width.value }"
              @click="changePenWidth(width.value)"
            >
              <span class="width-preview">
                <span class="width-line" :style="{ height: width.value + 'px' }" />
              </span>
              <span v-if="!isMobile" class="tool-text">{{ width.label }}</span>
            </button>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="tool-group actions">
          <button class="action-button" :disabled="historyStep <= 0" @click="undo">
            <Icon name="mdi:undo" />
            <span v-if="!isMobile">{{ $t('tools.signatureGenerator.undo') }}</span>
          </button>
          <button class="action-button" :disabled="historyStep >= history.length - 1" @click="redo">
            <Icon name="mdi:redo" />
            <span v-if="!isMobile">{{ $t('tools.signatureGenerator.redo') }}</span>
          </button>
          <button class="action-button" @click="clearCanvas">
            <Icon name="mdi:delete-sweep" />
            <span v-if="!isMobile">{{ $t('tools.signatureGenerator.clear') }}</span>
          </button>
        </div>
      </div>

      <!-- Canvas -->
      <div class="canvas-wrapper">
        <canvas
          ref="canvas"
          class="signature-canvas"
          :width="canvasSize.width"
          :height="canvasSize.height"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="endDrawing"
          @mouseleave="endDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="endDrawing"
        />
      </div>

      <!-- 다운로드 옵션 -->
      <div class="download-section">
        <div class="format-selector">
          <label class="format-label">{{ $t('tools.signatureGenerator.format') }}:</label>
          <div class="format-options">
            <label class="format-option">
              <input v-model="fileFormat" type="radio" value="png" />
              <span>PNG</span>
            </label>
            <label class="format-option">
              <input v-model="fileFormat" type="radio" value="jpg" />
              <span>JPG</span>
            </label>
          </div>
        </div>

        <div class="download-buttons">
          <button class="btn btn-primary" @click="download">
            <Icon name="mdi:download" />
            {{ $t('common.download') }}
          </button>
          <button class="btn btn-secondary" @click="copyToClipboard">
            <Icon name="mdi:content-copy" />
            {{ $t('common.copy') }}
          </button>
        </div>
      </div>

      <!-- 안내 정보 -->
      <div class="card info-section">
        <h2 class="info-title">
          <Icon name="mdi:information" />
          {{ $t('tools.signatureGenerator.info.title') }}
        </h2>
        <ul class="info-list">
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.signatureGenerator.info.item1') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.signatureGenerator.info.item2') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.signatureGenerator.info.item3') }}</span>
          </li>
          <li class="info-item">
            <Icon name="mdi:check-circle" />
            <span>{{ $t('tools.signatureGenerator.info.item4') }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.signature-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--fe-shadow-sm);

  &.mobile {
    position: sticky;
    bottom: 0;
    z-index: 100;
    gap: 12px;
    padding: 12px;
  }
}

.tool-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.actions {
    flex-direction: row;
    align-items: center;
    margin-left: auto;
  }
}

.tool-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--fe-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 2px solid var(--fe-gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--fe-primary);
    background: var(--fe-gray-50);
  }

  &.active {
    border-color: var(--fe-primary);
    background: var(--fe-primary-light);
  }
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--fe-gray-300);
}

.width-preview {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.width-line {
  width: 100%;
  background: var(--fe-gray-700);
  border-radius: 2px;
}

.tool-text {
  font-size: 13px;
  font-weight: 500;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: 2px solid var(--fe-gray-200);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: var(--fe-primary);
  }
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 1px solid var(--fe-gray-200);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--fe-gray-700);
  cursor: pointer;
  transition: all 0.2s;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: var(--fe-gray-50);
    border-color: var(--fe-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: var(--fe-gray-50);
  border-radius: 12px;
}

.signature-canvas {
  background: white;
  border: 2px solid var(--fe-gray-300);
  border-radius: 8px;
  cursor: crosshair;
  touch-action: none;
  box-shadow: var(--fe-shadow-md);
}

.download-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--fe-shadow-sm);
}

.format-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--fe-gray-700);
}

.format-options {
  display: flex;
  gap: 16px;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--fe-gray-700);

  input[type='radio'] {
    cursor: pointer;
  }
}

.download-buttons {
  display: flex;
  gap: 12px;
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
}

.btn-primary {
  background: var(--fe-primary);
  color: white;

  &:hover {
    background: var(--fe-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--fe-shadow-md);
  }
}

.btn-secondary {
  background: white;
  color: var(--fe-primary);
  border: 2px solid var(--fe-primary);

  &:hover {
    background: var(--fe-primary-light);
    transform: translateY(-2px);
  }
}

.info-section {
  margin-top: 20px;
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

// 모바일 반응형
@media (max-width: 768px) {
  .toolbar {
    &.mobile {
      .tool-group {
        flex-direction: row;
        align-items: center;

        &.actions {
          margin-left: 0;
        }
      }

      .tool-label {
        display: none;
      }

      .tool-button {
        padding: 8px;
      }

      .action-button {
        padding: 8px;
      }
    }
  }

  .download-section {
    flex-direction: column;
    align-items: stretch;
  }

  .format-selector {
    justify-content: center;
  }

  .download-buttons {
    justify-content: center;
  }
}
</style>
