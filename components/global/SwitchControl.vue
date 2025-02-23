<!-- components/controls/SwitchControl.vue -->
<template>
  <ControlsControlWrapper :control="control">
    <div  class="flex items-center justify-between">
      <span>{{ control.meta.title?.en || control.name }}</span>
      <UToggle
          :model-value="value === '1'"
          :disabled="control.meta.readonly || !!control.error"
          @update:model-value="$emit('update:value', $event ? '1' : '0')"
      />
    </div>
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