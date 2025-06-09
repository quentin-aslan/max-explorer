<template>
  <section
    v-if="isLoaderVisible"
    class="z-50 top-0 fixed flex flex-col items-center justify-center text-center min-h-screen w-screen bg-white/95 backdrop-blur-sm"
  >
    <!-- Animation de train -->
    <div class="relative mb-8">
      <!-- Rails -->
      <div class="w-64 h-2 bg-gray-300 rounded-full relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-max-action/30 to-transparent animate-pulse" />
      </div>

      <!-- Train animé -->
      <div class="absolute -top-6 w-12 h-12 animate-train">
        <div class="w-full h-full bg-gradient-to-r from-max-action to-max-special rounded-lg shadow-lg flex items-center justify-center transform rotate-3">
          <span class="text-white text-xl">🚂</span>
        </div>
      </div>
    </div>

    <!-- Message de chargement -->
    <div class="max-w-md text-center">
      <h3 class="text-xl font-sans-bold text-max-pri mb-2">
        Recherche en cours...
      </h3>
      <p class="text-max-pri/70 font-sans-medium">
        {{ messageDisplayed }}
      </p>
    </div>

    <!-- Points animés -->
    <div class="flex space-x-2 mt-4">
      <div
        class="w-2 h-2 bg-max-action rounded-full animate-bounce"
        style="animation-delay: 0ms"
      />
      <div
        class="w-2 h-2 bg-max-special rounded-full animate-bounce"
        style="animation-delay: 150ms"
      />
      <div
        class="w-2 h-2 bg-max-action rounded-full animate-bounce"
        style="animation-delay: 300ms"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
const { isLoaderVisible, messageDisplayed } = useLoader()
</script>

<style scoped>
@keyframes train {
  0% {
    left: -3rem;
    transform: translateX(0) rotate(3deg);
  }
  50% {
    transform: translateX(0) rotate(-1deg);
  }
  100% {
    left: calc(100% + 1rem);
    transform: translateX(0) rotate(3deg);
  }
}

.animate-train {
  animation: train 3s linear infinite;
}
</style>
