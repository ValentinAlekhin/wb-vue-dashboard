<script setup lang="ts">
defineProps<{
  control: Control
  value: string | number
}>()
</script>

<template>
  <ControlsControlWrapper :control="control">
    <div class="flex items-center justify-between">
      <span>{{ control.meta?.title?.en || control.name }}</span>
      <span>{{ value }} <span class="text-gray-500">{{ control.meta.units || '' }}</span></span>
    </div>
  </ControlsControlWrapper>
</template>
