<!-- components/controls/RangeControl.vue -->
<template>
  <ControlsControlWrapper :control="control">
    <span class="block mb-1">{{ control.meta.title?.en || control.name }}: {{ value }}</span>
    <URange
        :model-value="Number(value)"
        :min="control.meta.min ?? 0"
        :max="control.meta.max ?? 255"
        :disabled="control.meta.readonly || !!control.error"
        @update:model-value="emitValue"
    />
  </ControlsControlWrapper>
</template>

<script setup lang="ts">
import type { Control } from '~/stores/devices';
import debounce from 'lodash-es/debounce'

defineProps<{
  control: Control;
  value: string | number;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>();

const emitValue = debounce((value) => emit('update:value', String(value)), 300);
</script>