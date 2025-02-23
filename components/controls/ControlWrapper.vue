<!-- components/controls/ControlWrapper.vue -->
<template>
  <div>
    <slot />
    <p v-if="control.error" class="text-red-500 text-xs mt-2">{{ errorMessage }}</p>

    <UDivider class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import type { Control } from '~/stores/devices';

const props = defineProps<{
  control: Control;
}>();

const errorMessage = computed(() => {
  const error = String(props.control.error || '');
  if (!error) return '';

  const messages: string[] = [];
  if (error.includes('r')) messages.push('Ошибка чтения');
  if (error.includes('w')) messages.push('Ошибка записи');
  if (error.includes('p')) messages.push('Пропущен период чтения');

  return messages.length > 0 ? messages.join(', ') : error;
});

</script>