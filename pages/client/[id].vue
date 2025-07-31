<script setup lang="ts">
const route = useRoute()
const { publishControl, init, disconnect } = useMqtt()
const { name } = useHeaderSearch()

const id = route.params.id as string

const clientsStore = useClientsStore()
const deviceStore = useDevicesStore()

const query = computed(() => name.value.toLowerCase())

const devices = computed(() => Object.values(deviceStore.devices)
  .filter((d) => {
    const dName = d.name.toLowerCase()
    const nameEn = (d.meta?.title?.en || '').toLowerCase()

    return dName.includes(query.value) || nameEn.includes(query.value)
  })
  .sort((a, b) => a.name.localeCompare(b.name)))

function handleControlUpdate({ deviceName, controlName, value }: { deviceName: string, controlName: string, value: string }) {
  publishControl(deviceName, controlName, value)
}

onMounted(() => {
  if (import.meta.server)
    return

  const client = clientsStore.getClient(id)
  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }

  init(client)
})

onUnmounted(() => {
  disconnect()
  deviceStore.reset()
})
</script>

<template>
  <div class="p-4">
    <MasonryWall :items="devices" :gap="16" :max-columns="10">
      <template #default="{ item }">
        <DeviceCard
          :device="item"
          @update:control="handleControlUpdate"
        />
      </template>
    </MasonryWall>
  </div>
</template>
