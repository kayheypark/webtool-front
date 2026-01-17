<script setup lang="ts">
interface Props {
  modelValue: string
  maxlength?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 500,
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textLength = computed(() => props.modelValue.length)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="textarea">
    <textarea
      class="txtarea"
      :value="modelValue"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <div class="count">
      <span class="now">{{ textLength }}</span
      >{{ maxlength }}
    </div>
  </div>
</template>
