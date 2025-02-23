<!-- components/controls/TextControl.vue -->
<template>
  <ControlsControlWrapper :control="control">
    <span class="block mb-1">{{ control.meta.title?.en || control.name }}</span>

    <UInput
        :model-value="value"
        :disabled="control.meta.readonly || !!control.error"
        @update:model-value="$emit('update:value', $event)"
        placeholder="Enter text"
    />
  </ControlsControlWrapper>
</template>

<script setup lang="ts">
import type { Control } from '~/stores/devices';

defineProps<{
  control: Control;
  value: string | number;
}>();

defineEmits<{
  (e: 'update:value', value: string): void;
}>();
</script>