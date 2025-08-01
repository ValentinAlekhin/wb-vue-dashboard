import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  css: ['~/assets/css/main.css'],

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
    'pinia-plugin-persistedstate',
  ],
  imports: {
    dirs: ['stores/*', 'constants/*'],
  },

  typescript: {
    strict: true,
    shim: false,
  },
})
