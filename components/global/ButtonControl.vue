<!-- components/controls/ButtonControl.vue -->
<template>
  <ControlsControlWrapper :control="control">
    <UButton
        :disabled="control.meta.readonly || !!control.error"
        @click="$emit('update:value', '1')"
    >
      {{ control.meta.title?.en || control.name }}
    </UButton>
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