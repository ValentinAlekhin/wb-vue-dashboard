<script setup lang="ts">
defineProps<{
  control: Control
  value: string | number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const dataValue = ref('')

function send(): void {
  emit('update:value', dataValue.value)
  dataValue.value = ''
}
</script>

<template>
  <ControlsControlWrapper :control="control">
    <span class="block mb-1">{{ control.meta.title?.en || control.name }}</span>

    <UBadge v-if="value" color="neutral" variant="outline" size="xl">
      {{ value }}
    </UBadge>

    <template v-if="!(control.meta.readonly || !!control.error)">
      <UInput
        v-model="dataValue"
        placeholder="Enter text"
        class="w-full mt-2"
      />

      <UButton v-if="dataValue.length" trailing-icon="lucide-send-horizontal" label="Send" block class="mt-2" @click="send" />
    </template>
  </ControlsControlWrapper>
</template>
