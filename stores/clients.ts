import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Client {
  id: string
  name: string
  url: string
  password?: string
  user?: string
}

export const useClientsStore = defineStore(
  'mqtt',
  () => {
    const connections = ref<Client[]>([])

    // Добавление нового подключения
    const addClient = (connection: Omit<Client, 'id'>) => {
      const newConnection: Client = {
        ...connection,
        id: nanoid(),
      }
      connections.value.push(newConnection)
      return newConnection
    }

    // Удаление подключения по ID
    const removeClient = (id: string) => {
      const index = connections.value.findIndex(conn => conn.id === id)
      if (index !== -1) {
        connections.value.splice(index, 1)
        return true
      }
      return false
    }

    // Обновление подключения
    const updateClient = (
      id: string,
      updates: Partial<Omit<Client, 'id'>>,
    ) => {
      const connection = connections.value.find(conn => conn.id === id)
      if (connection) {
        Object.assign(connection, updates)
        return true
      }
      return false
    }

    // Получение подключения по ID
    const getClient = (id: string) => {
      return connections.value.find(conn => conn.id === id)
    }

    return {
      connections,
      addClient,
      removeClient,
      updateClient,
      getClient,
    }
  },
  {
    persist: true,
  },
)
