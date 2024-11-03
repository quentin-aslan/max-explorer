<template>
  <div class="relative min-h-screen">
    <!-- Image d'arrière-plan -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url('${bgUrl}')` }"
    />
    <!-- Contenu de la page -->
    <div
      class="relative min-h-screen flex flex-col lg:flex-row lg:gap-8 lg:p-44 p-10"
    >
      <!-- Section texte -->
      <div class="order-1 lg:order-2 lg:w-3/5 flex lg:justify-top">
        <div class="flex flex-col gap-6 lg:text-center">
          <!-- Logo Max Explorer -->
          <h1 class="lg:block text-4xl font-sans-bold text-max-pri">
            Max Explorer
          </h1>

          <h3 class="lg:block text-xl text-max-pri">
            Découvre la France en train.
          </h3>

          <!-- Formulaire de recherche en version mobile -->
          <SearchFormVertical v-if="isMobile" />

          <!-- Paragraphe descriptif -->
          <p class="text-xl text-max-pri">
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
const bgUrl = ['/train-illustration.svg']
</script>
