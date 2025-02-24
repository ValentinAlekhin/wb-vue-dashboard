import { defineNuxtConfig } from 'nuxt/config'

// eslint-disable-next-line node/prefer-global/process
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

  app: {
    head: {
      title: 'Vue WB Dashboard',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
        {
          name: 'theme-color',
          content: '#030712',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
