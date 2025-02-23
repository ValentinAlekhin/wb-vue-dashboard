<!-- components/DeviceCard.vue -->
<template>
  <UCard :class="{ 'border-red-500': device.error }">
    <template #header>
      <div class="flex items-center justify-between">
        <h2>{{ device.meta?.title?.en || device.name }}</h2>

        <UButton :label="open ? 'Close' : 'Open'" @click="open = !open" color="gray" variant="solid" />
      </div>


      <p v-if="device.error" class="text-red-500 text-sm">Error: {{ device.error }}</p>
    </template>
    <div v-if="open" class="space-y-4">
      <component
          v-for="(control, name) in device.controls"
          :key="name"
          :is="getComponent(control.type)"
          :control="control"
          :value="control.value"
          @update:value="$emit('update:control', { deviceName: device.name, controlName: name, value: $event })"
      />
    </div>

    <div v-else class="flex items-center justify-center">
      <span class="text-gray-700">Controls count: {{ controlsCount }}</span>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Device } from '~/stores/devices';
import { useLocalStorage } from '@vueuse/core'


const props =  defineProps<{
  device: Device;
}>();

defineEmits<{
  (e: 'update:control', payload: { deviceName: string; controlName: string; value: string }): void;
}>();

const open = useLocalStorage(props.device.name, false)

const controlComponents: Record<string, string> = {
  switch: 'SwitchControl',
  range: 'RangeControl',
  value: 'ValueControl',
  temperature: 'ValueControl',
  lux: 'ValueControl',
  rel_humidity: 'ValueControl',
  text: 'TextControl',
  pushbutton: 'ButtonControl',
};

function getComponent(type: string) {
  const name = controlComponents[type]
  if (!name) {
    return 'div';
  }

  return resolveComponent(controlComponents[type]);
}

const controlsCount = computed(() => Object.keys(props.device.controls).length)
</script>