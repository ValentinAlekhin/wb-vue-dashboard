<script setup lang="ts">
import { useClientsStore } from '~/stores/clients'

const clientsStore = useClientsStore()
const router = useRouter()

// Состояние модальных окон
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const editingClientId = ref<string | null>(null)

function navigateToClient(id: string) {
 router.push(`/client/${id}`)
}

function openSettings(event: Event, clientId: string) {
 event.stopPropagation()
 editingClientId.value = clientId
 isEditModalOpen.value = true
}

function openCreateModal() {
 isCreateModalOpen.value = true
}

function deleteClient(event: Event, clientId: string) {
 event.stopPropagation()
 clientsStore.removeClient(clientId)
}
</script>

<template>
 <div class="space-y-4">
  <!-- Заголовок с кнопкой добавления -->
  <div class="flex items-center justify-between">
   <h1 class="text-2xl font-bold">Clients</h1>
   <UButton
    icon="i-heroicons-plus"
    color="primary"
    variant="solid"
    size="sm"
    @click="openCreateModal"
   >
    Add
   </UButton>
  </div>

  <!-- Список клиентов -->
  <div class="space-y-2">
   <UCard
    v-for="client in clientsStore.connections"
    :key="client.id"
    class="cursor-pointer"
    @click="navigateToClient(client.id)"
   >
    <div class="flex items-center justify-between">
     <div class="flex-1">
      <h3 class="font-medium">
       {{ client.name }}
      </h3>
      <p class="text-sm text-gray-500">
       {{ client.url }}
      </p>
     </div>
     <div class="flex items-center gap-2">
      <UButton
       icon="i-heroicons-cog-6-tooth"
       color="neutral"
       variant="ghost"
       size="sm"
       @click="event => openSettings(event, client.id)"
      />
      <UButton
       icon="i-heroicons-trash"
       color="error"
       variant="ghost"
       size="sm"
       @click="event => deleteClient(event, client.id)"
      />
     </div>
    </div>
   </UCard>
  </div>

  <!-- Пустое состояние -->
  <div v-if="clientsStore.connections.length === 0" class="text-center py-8">
   <UIcon
    name="i-heroicons-user-group"
    class="mx-auto h-12 w-12 text-gray-400"
   />
   <h3 class="mt-2 text-sm font-medium text-gray-900">No clients</h3>
   <p class="mt-1 text-sm text-gray-500">Get started by adding a new client.</p>
  </div>

  <!-- Модальные окна -->
  <CreateClientModal v-model="isCreateModalOpen" />
  <EditClientModal v-model="isEditModalOpen" :client-id="editingClientId" />
 </div>
</template>
