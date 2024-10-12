import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
    public: {},
  },
  css: ['~/assets/main.css'],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    //'@prisma/nuxt',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})