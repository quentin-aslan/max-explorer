<template>
  <TheLoader />
  <div class="md:p-15 flex flex-col justify-center lg:items-center lg:flex-row lg:gap-8 p-6">
    <!-- Barre de recherche sur la gauche en mode desktop -->
    <div class="order-2 lg:order-1 lg:w-1/3 flex justify-center lg:justify-start">
      <SearchFromV2 />
    </div>

    <!-- Section texte -->
    <div class="order-1 lg:order-2 lg:w-2/3 flex lg:justify-start">
      <div class="flex flex-col justify-between lg:text-left p-6 lg:p-12">
        <h1 class="text-2xl lg:text-5xl font-bold text-surface-900 mb-4">
          Découvre la France 🇫🇷 <br> <span class="text-blue-800">avec MAX JEUNE</span>
          <br />
        </h1>
        <p class="text-lg text-surface-700 leading-relaxed">
          <span>Renseigne simplement ta ville de départ et tes dates et on te propose la liste des destinations eligible <span class="text-blue-900 font-bold">MAX JEUNE à <span class="text-2xl">0€</span></span> !</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchFromV2 from "~/components/SearchFormVertical.vue";
</script>
