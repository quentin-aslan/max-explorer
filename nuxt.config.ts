import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
    public: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  },
  alias: {
    ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
  },
  css: ['~/assets/main.css'],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@prisma/nuxt',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  prisma: {
    installStudio: false,
  },

})