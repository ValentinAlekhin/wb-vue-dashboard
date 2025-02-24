<!-- pages/index.vue -->
<script setup lang="ts">
import { useDevicesStore } from '~/stores/devices'

const { publishControl, init } = useMqtt()

const store = useDevicesStore()
const devices = computed(() => Object.values(store.devices).sort((a, b) => a.name.localeCompare(b.name)))

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
