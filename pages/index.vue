<script setup lang="ts">
const { publishControl, init } = useMqtt()
const { name } = useHeaderSearch()

const store = useDevicesStore()

const query = computed(() => name.value.toLowerCase())

const devices = computed(() => Object.values(store.devices)
  .filter((d) => {
    const dName = d.name.toLowerCase()
    const nameEn = (d.meta?.title?.en || '').toLowerCase()

    return dName.includes(query.value) || nameEn.includes(query.value)
  })
  .sort((a, b) => a.name.localeCompare(b.name)))

function handleControlUpdate({ deviceName, controlName, value }: { deviceName: string, controlName: string, value: string }) {
  publishControl(deviceName, controlName, value)
}

callOnce(() => init())
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
