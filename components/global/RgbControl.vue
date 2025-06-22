<script setup lang="ts">
import debounce from 'lodash-es/debounce'

const { value } = defineProps<{
  control: Control
  value: string
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const emitValue = debounce((emitValue) => {
  const { r, g, b } = hexToRgb(emitValue)
  emit('update:value', `${r};${g};${b}`)
}, 300)

function rgbToHex(r: number, g: number, b: number) {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

const hex = computed(() => {
  const [r, g, b] = value.split(';')
  return rgbToHex(+r, +g, +b)
})

const chip = computed(() => ({ backgroundColor: hex.value }))
</script>

<template>
  <ControlsControlWrapper :control="control">
    <div class="flex justify-between items-center mb-1">
      <span>{{ control.meta.title?.en || control.name }}</span>
      <UPopover>
        <UButton label="Color" color="neutral" variant="outline" :disabled="control.meta.readonly || !!control.error">
          <template #trailing>
            <span :style="chip" class="size-3 rounded-full" />
          </template>
        </UButton>

        <template #content>
          <UColorPicker
            :model-value="hex"
            :disabled="control.meta.readonly || !!control.error"
            @update:model-value="emitValue"
          />
        </template>
      </UPopover>
    </div>
  </ControlsControlWrapper>
</template>
