import Aura from '@primevue/themes/aura';
import {definePreset} from "@primevue/themes";


const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{blue.900}',
          inverseColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      }
    }
  }
});


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  build: {
    transpile: ['@googlemaps/js-api-loader'],
  },
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
    public: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  },
  routeRules: {
    '/results': { ssr: false },
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
        preset: MyPreset,
        options: { darkModeSelector: ".fake-dark-selector" }
      }
    }
  },
  prisma: {
    installStudio: false,
  },

})