import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

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
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{blue.900}',
          inverseColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },
})

export default defineNuxtConfig({
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/eslint',
    'nuxt-cron',
  ],
  devtools: { enabled: false },
  css: ['~/assets/main.css'],
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    LAUNCH_CRON_ON_INIT: process.env.LAUNCH_CRON_ON_INIT,
    openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
  },
  routeRules: {
    '/results': { ssr: false },
  },
  compatibilityDate: '2024-04-03',
  cron: {
    timeZone: 'Europe/Paris',
    jobsDir: 'cron',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  primevue: {
    options: {
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: '.fake-dark-selector' },
      },
      locale: {
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
          'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
        ],
        monthNamesShort: [
          'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
        ],
        today: 'Aujourd\'hui',
        clear: 'Effacer',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Sem', // Pour l'en-tête de la semaine
      },
    },
  },
})
