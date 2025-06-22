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
    <span class="block mb-1">{{ control.meta.title?.en || control.name }}</span>

    <UInput
      :model-value="value"
      :disabled="control.meta.readonly || !!control.error"
      placeholder="Enter text"
      @update:model-value="$emit('update:value', $event)"
    />
  </ControlsControlWrapper>
</template>
