<script setup lang="ts">
import * as v from 'valibot'
import { useClientsStore } from '~/stores/clients'

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { modelValue, clientId } = toRefs(props)

const clientsStore = useClientsStore()

// Props
interface Props {
  modelValue: boolean
  clientId: string | null
}

// Схема валидации для клиента
const clientSchema = v.object({
  name: v.string('Name is required'),
  url: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your url.'),
    v.url('The url is badly formatted.'),
  ),
  password: v.optional(v.string()),
  user: v.optional(v.string()),
})

// Состояние формы
const state = reactive({
  name: '',
  url: '',
  password: '',
  user: '',
})

// Computed для v-model
const isOpen = computed({
  get: () => modelValue.value,
  set: value => emit('update:modelValue', value),
})

// Наблюдаем за изменением клиента и заполняем форму
watch(
  clientId,
  (clientId) => {
    if (clientId) {
      const clientData = clientsStore.getClient(clientId)
      if (clientData) {
        state.name = clientData.name
        state.url = clientData.url
        state.password = clientData.password || ''
        state.user = clientData.user || ''
      }
    }
  },
  { immediate: true },
)

function closeModal() {
  isOpen.value = false
  // Сброс формы
  Object.assign(state, {
    name: '',
    url: '',
    password: '',
    user: '',
  })
}

function handleSubmit() {
  if (!clientId.value) {
    closeModal()
    return
  }

  clientsStore.updateClient(clientId.value, {
    name: state.name,
    url: state.url,
    password: state.password || undefined,
    user: state.user || undefined,
  })
  closeModal()
}
</script>

<template>
  <UModal v-model:open="isOpen" title="Edit Client">
    <template #body>
      <UForm :schema="clientSchema" :state="state" class="space-y-4" @submit="handleSubmit">
        <UFormField class="w-full" name="name" label="Name" required>
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter client name"
          />
        </UFormField>

        <UFormField class="w-full" name="url" label="URL" required>
          <UInput
            v-model="state.url"
            class="w-full"
            placeholder="Enter client URL"
          />
        </UFormField>

        <UFormField class="w-full" name="user" label="Username (optional)">
          <UInput
            v-model="state.user"
            class="w-full"
            placeholder="Enter username"
          />
        </UFormField>

        <UFormField class="w-full" name="password" label="Password (optional)">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter password"
            class="w-full"
          />
        </UFormField>

        <UButton color="primary" type="submit" block>
          Save
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
