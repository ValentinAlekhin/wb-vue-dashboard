<script setup lang="ts">
const route = useRoute()
const { connectionStatus } = useMqtt()
const { name, setName } = useHeaderSearch()
const clientsStore = useClientsStore()

const id = computed(() => route.params.id as string)

const client = computed(() => clientsStore.getClient(id.value))

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

    <template v-if="id">
      <UInput
        :model-value="name"
        placeholder="Enter device name"
        icon="i-lucide-search"
        @update:model-value="setName"
      />

      <div class="flex items-center space-x-2">
        <span class="text-sm">{{ client?.name }}</span>
        <UBadge :color="statusColor" :variant="statusVariant">
          {{ statusText }}
        </UBadge>
      </div>
    </template>
  </header>
</template>
