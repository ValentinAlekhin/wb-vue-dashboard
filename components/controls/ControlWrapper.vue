<script setup lang="ts">
const props = defineProps<{
  control: Control
}>()

const errorMessage = computed(() => {
  const error = String(props.control.error || '')
  if (!error)
    return ''

  const messages: string[] = []
  if (error.includes('r'))
    messages.push('Read error')
  if (error.includes('w'))
    messages.push('Write error')
  if (error.includes('p'))
    messages.push('Missed the reading period')

  return messages.length > 0 ? messages.join('\n') : error
})
</script>

<template>
  <div>
    <slot />
    <p v-if="control.error" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>

    <USeparator class="mt-2" />
  </div>
</template>
