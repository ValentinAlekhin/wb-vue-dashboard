<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { get, set } from 'lodash-es'

const props = defineProps<{
  device: Device
}>()
defineEmits<{
  (e: 'update:control', payload: { deviceName: string, controlName: string, value: string }): void
}>()

const { device } = toRefs(props)

const open = useLocalStorage(device.value.name, false)

const controls = computed<Record<string, Control>>(() => Object.entries(device.value.controls)
  .sort((a, b) => get(a, '[1].meta.order', 0) - get(b, '[1].meta.order', 0))
  .reduce((acc, v) => {
    set(acc, v[0], v[1])
    return acc
  }, {}))

const controlComponents: Record<string, string> = {
  switch: 'SwitchControl',
  range: 'RangeControl',
  value: 'ValueControl',
  temperature: 'ValueControl',
  lux: 'ValueControl',
  rel_humidity: 'ValueControl',
  text: 'TextControl',
  pushbutton: 'ButtonControl',
  rgb: 'RgbControl',
}

function getComponent(type: string) {
  const name = controlComponents[type]
  if (!name) {
    return 'div'
  }

  return resolveComponent(controlComponents[type])
}

const controlsCount = computed(() => Object.keys(device.value.controls).length)
</script>

<template>
  <UCard :class="{ 'border-red-500': device.error }">
    <template #header>
      <div class="flex items-center justify-between">
        <h2>{{ device.meta?.title?.en || device.name }}</h2>

        <UButton
          :icon="`i-lucide-chevron-${open ? 'up' : 'down'}`"
          color="neutral"
          variant="soft"
          @click="open = !open"
        />
      </div>

      <p v-if="device.error" class="text-red-500 text-sm">
        Error: {{ device.error }}
      </p>
    </template>
    <div v-if="open" class="space-y-4">
      <component
        :is="getComponent(control.type)"
        v-for="(control, name) in controls"
        :key="name"
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
