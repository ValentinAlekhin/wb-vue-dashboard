<!-- components/controls/ValueControl.vue -->
<template>
  <ControlsControlWrapper :control="control">
    <div class="flex items-center justify-between">
      <span>{{ control.meta?.title?.en || control.name }}</span>
      <span>{{ value }} {{ control.meta.units || '' }}</span>
    </div>

  </ControlsControlWrapper>
</template>

<script setup lang="ts">
import type { Control } from '~/stores/devices';

defineProps<{
  control: Control;
  value: string | number;
}>();
</script>