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
    <UButton
      :disabled="control.meta.readonly || !!control.error"
      @click="$emit('update:value', '1')"
    >
      {{ control.meta.title?.en || control.name }}
    </UButton>
  </ControlsControlWrapper>
</template>
