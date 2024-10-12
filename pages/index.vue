<template>
  <TheLoader />
  <div class="md:p-15 flex flex-col justify-center lg:items-center lg:flex-row gap-8 p-6">
    <!-- Barre de recherche sur la gauche en mode desktop -->
    <div class="order-2 lg:order-1 lg:w-1/3 flex justify-center lg:justify-start">
      <SearchFromV2 />
    </div>

    <!-- Section texte -->
    <div class="order-1 lg:order-2 lg:w-2/3 flex lg:justify-start">
      <div class="text-center flex flex-col justify-between lg:text-left p-6 lg:p-12">
        <h1 class="text-3xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
          Découvre la France 🇫🇷
          <br />
          <span class="text-blue-800 dark:text-blue-400">Voyage avec MAX JEUNE</span>
        </h1>
        <p class="text-lg text-surface-700 dark:text-surface-200 leading-relaxed">
          Profite de trajets gratuits et illimités avec MAX JEUNE ! Pars à l'aventure depuis ta ville en quelques clics.
          <br />
          Pas besoin d'une destination précise ? Renseigne simplement ta ville de départ et tes dates, et on s'occupe du reste !
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchFromV2 from "~/components/SearchFormVertical.vue";
</script>
