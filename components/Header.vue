<script setup lang="ts">
import { useHeaderSearch } from '~/composables/useHeaderSearch'

const { connectionStatus } = useMqtt()
const { name, setName } = useHeaderSearch()

const statusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return 'Connected'
    case 'reconnecting': return 'Reconnecting'
    case 'offline': return 'Offline'
    default: return 'Unknown'
  }
})

const statusColor = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return 'success'
    case 'reconnecting': return 'warning'
    case 'offline': return 'error'
    default: return 'neutral'
  }
})

const statusVariant = computed(() => {
  return connectionStatus.value === 'connected' ? 'solid' : 'outline'
})
</script>

<template>
  <header class="bg-background/75 fixed top-0 z-50 -mb-px w-full  backdrop-blur p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 mx-auto">
    <NuxtLink to="/">
      <h1 class="text-lg font-semibold">
        MQTT Devices
      </h1>
    </NuxtLink>

    <UInput
      :model-value="name"
      placeholder="Enter device name"
      icon="i-lucide-search"
      @update:model-value="setName"
    />

    <div class="flex items-center space-x-2">
      <span class="text-sm">{{ '' }}</span>
      <UBadge :color="statusColor" :variant="statusVariant">
        {{ statusText }}
      </UBadge>
    </div>
  </header>
</template>
