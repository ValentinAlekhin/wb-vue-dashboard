import { defineNuxtConfig } from 'nuxt/config'

const { NUXT_PUBLIC_MQTT_BROKER } = process.env

console.table({
  NUXT_PUBLIC_MQTT_BROKER,
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  runtimeConfig: {
    public: {
      mqttBroker: '',
    },
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],
  imports: {
    dirs: ['stores/*', 'constants/*'],
  },

  typescript: {
    strict: true,
    shim: false,
  },
})
