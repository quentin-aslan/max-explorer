<template>
  <div class="min-h-screen flex flex-col justify-center lg:items-center lg:flex-row lg:gap-8 p-6 md:p-15 bg-gray-50">
    <!-- Section texte avec les étapes -->
    <div class="order-1 lg:order-2 lg:w-3/5 flex lg:justify-start">
      <div class="flex flex-col gap-4 lg:text-left">
        <!-- Logo MaxJeune avec attribut alt descriptif -->
        <NuxtImg
            src="/brand-logo-max-junior.svg"
            alt="Logo de l'abonnement MAX JEUNE"
            class="w-40"
        />

        <!-- Utilisation appropriée des balises de titre -->
        <h1 class="hidden lg:block text-xl lg:text-3xl font-bold text-gray-900">
          Découvrez de nouvelles destinations 🇫🇷
        </h1>

          <!-- Formulaire de recherche en version mobile -->
          <SearchFormVertical v-if="isMobile" />

        <!-- Présentation des étapes avec balises de liste pour une meilleure sémantique -->
        <ol class="flex flex-col lg:gap-4 list-decimal list-inside">
          <li class="flex items-center mb-4 lg:mb-0 lg:mr-8">
            <i class="pi pi-map-marker text-blue-900 text-3xl mr-2"/>
            <span class="text-lg">1. Indique ta ville de départ</span>
          </li>
          <li class="flex items-center mb-4 lg:mb-0 lg:mr-8">
            <i class="pi pi-calendar text-blue-900 text-3xl mr-2"/>
            <span class="text-lg">2. Choisis tes dates</span>
          </li>
          <li class="flex items-center">
            <i class="pi pi-compass text-blue-900 text-3xl mr-2"/>
            <span class="text-lg">3. Découvre où tu peux aller à 0€</span>
          </li>
        </ol>

        <!-- Ajout d'un paragraphe descriptif pour enrichir le contenu -->
        <p class="text-lg">
          Utilisez notre application pour tirer le meilleur parti de votre abonnement <strong>MAX JEUNE</strong>. Découvrez toutes les destinations accessibles depuis votre ville de départ en quelques clics !
        </p>

      </div>
    </div>

    <!-- Barre de recherche sur la gauche en mode desktop -->
    <div v-if="!isMobile" class="order-2 lg:order-1 lg:w-2/5 lg:flex justify-center lg:justify-start">
      <SearchFormVertical />
    </div>
  </div>
</template>
<script setup lang="ts">
const { isMobile } = useIsMobile()

const a: string[] = ['']
console.log(a)
</script>