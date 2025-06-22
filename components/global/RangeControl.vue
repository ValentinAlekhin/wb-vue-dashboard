<script setup lang="ts">
import debounce from 'lodash-es/debounce'

defineProps<{
  control: Control
  value: string | number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const emitValue = debounce(value => emit('update:value', String(value)), 300)
</script>

<template>
  <ControlsControlWrapper :control="control">
    <div class="flex justify-between items-center mb-1">
      <span>{{ control.meta.title?.en || control.name }}</span>
      <span>{{ value }}</span>
    </div>
    <USlider
      :model-value="Number(value)"
      :min="control.meta.min ?? 0"
      :max="control.meta.max ?? 255"
      :disabled="control.meta.readonly || !!control.error"
      @update:model-value="emitValue"
    />
  </ControlsControlWrapper>
</template>
