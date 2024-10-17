<template>
  <div class="relative min-h-screen">
    <!-- Image d'arrière-plan -->
    <div :class="`absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('${bgUrl}')]`" />

    <!-- Filtre gris par-dessus l'image d'arrière-plan -->
    <div class="absolute inset-0 bg-gray-100 opacity-80" />

    <!-- Contenu de la page -->
    <div
      class="relative min-h-screen flex flex-col justify-center lg:items-center lg:flex-row lg:gap-8 p-6 md:p-15"
    >
      <!-- Section texte avec les étapes -->
      <div class="order-1 lg:order-2 lg:w-3/5 flex lg:justify-start">
        <div class="flex flex-col gap-4 lg:text-left ">
          <!-- Logo MaxJeune avec attribut alt descriptif -->
          <NuxtImg
            src="/brand-logo-max-junior.svg"
            alt="Logo de l'abonnement MAX JEUNE"
            class="w-40"
          />

          <!-- Titre -->
          <h1 class="hidden lg:block text-xl lg:text-3xl font-bold">
            Découvrez de nouvelles destinations 🇫🇷
          </h1>

          <!-- Formulaire de recherche en version mobile -->
          <SearchFormVertical v-if="isMobile" />

          <!-- Présentation des étapes -->
          <ol class="flex flex-col lg:gap-4 list-decimal list-inside">
            <li class="flex items-center mb-4 lg:mb-0 lg:mr-8">
              <i class="pi pi-map-marker text-blue-900 text-3xl mr-2" />
              <span class="text-lg">1. Indique ta ville de départ</span>
            </li>
            <li class="flex items-center mb-4 lg:mb-0 lg:mr-8">
              <i class="pi pi-calendar text-blue-900 text-3xl mr-2" />
              <span class="text-lg">2. Choisis tes dates</span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-compass text-blue-900 text-3xl mr-2" />
              <span class="text-lg">3. Découvre où tu peux aller à 0€</span>
            </li>
          </ol>

          <!-- Paragraphe descriptif -->
          <p class="text-lg">
            Utilise notre application pour tirer le meilleur parti de ton abonnement <strong>MAX JEUNE</strong>. Découvre toutes les destinations accessibles depuis ta ville de départ en quelques clics !
          </p>
        </div>
      </div>

      <!-- Barre de recherche sur la gauche en mode desktop -->
      <div
        v-if="!isMobile"
        class="order-2 lg:order-1 lg:w-2/5 lg:flex justify-center lg:justify-start"
      >
        <SearchFormVertical />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isMobile } = useIsMobile()

const BG_PATH = ['/rail-wp.jpeg', '/train-wp.jpeg', '/tgv-wp.jpeg']
// Random bg image
const bgUrl = BG_PATH[Math.floor(Math.random() * BG_PATH.length)]
</script>
