<script setup lang="ts">
import { computed } from 'vue'
import { useMqtt } from '~/composables/useMqtt'

const { connectionStatus, mqttBroker } = useMqtt()

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
    case 'connected': return 'green'
    case 'reconnecting': return 'yellow'
    case 'offline': return 'red'
    default: return 'gray'
  }
})

const statusVariant = computed(() => {
  return connectionStatus.value === 'connected' ? 'solid' : 'outline'
})
</script>

<template>
  <header class="bg-background/75 fixed top-0 z-50 -mb-px w-full  backdrop-blur p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 mx-auto">
    <h1 class="text-lg font-semibold">
      MQTT Devices
    </h1>
    <div class="flex items-center space-x-2">
      <span class="text-sm">{{ mqttBroker }}</span>
      <UBadge :color="statusColor" :variant="statusVariant">
        {{ statusText }}
      </UBadge>
    </div>
  </header>
</template>
