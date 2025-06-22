<script setup lang="ts">
defineProps<{
  control: Control
  value: string | number
}>()

defineEmits<{
  (e: 'update:value', value: string): void
}>()
</script>

<template>
  <ControlsControlWrapper :control="control">
    <div class="flex items-center justify-between">
      <span>{{ control.meta.title?.en || control.name }}</span>
      <USwitch
        :model-value="value === '1'"
        :disabled="control.meta.readonly || !!control.error"
        @update:model-value="$emit('update:value', $event ? '1' : '0')"
      />
    </div>
  </ControlsControlWrapper>
</template>
