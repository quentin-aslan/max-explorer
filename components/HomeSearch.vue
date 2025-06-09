<template>
  <form
    class="flex flex-col gap-5 w-full"
    @submit.prevent="research"
  >
    <div class="text-center mb-1">
      <h2 class="text-xl sm:text-2xl text-max-pri font-sans-bold mb-2">
        🎫 Planifie ton voyage
      </h2>
      <p class="text-max-pri/70 text-sm">
        Renseigne tes informations pour découvrir tes destinations
      </p>
    </div>

    <!-- Ville de départ (obligatoire) -->
    <div class="space-y-2">
      <label class="block text-sm font-sans-semibold text-max-pri flex items-center gap-2">
        <span class="w-6 h-6 bg-max-action rounded-full text-xs flex items-center justify-center text-max-pri font-sans-bold">1</span>
        Ville de départ <span class="text-red-500">*</span>
      </label>
      <StationInput
        v-model="departureStation"
        placeholder="Ex: Paris, Lyon, Toulouse..."
        class="w-full"
      />
    </div>

    <!-- Destination (optionnel) -->
    <div class="space-y-2">
      <label class="block text-sm font-sans-semibold text-max-pri flex items-center gap-2">
        <span class="w-6 h-6 bg-max-sec/30 rounded-full text-xs flex items-center justify-center text-max-pri font-sans-bold">2</span>
        Destination <span class="text-max-sec text-xs">(optionnel)</span>
      </label>
      <StationInput
        v-model="destinationStation"
        placeholder="Laisse vide pour explorer toutes les destinations"
        class="w-full"
      />
    </div>

    <!-- Dates -->
    <div class="space-y-2">
      <label class="text-sm font-sans-semibold text-max-pri flex items-center gap-2">
        <span class="w-6 h-6 bg-max-action rounded-full text-xs flex items-center justify-center text-max-pri font-sans-bold">3</span>
        Dates de voyage <span class="text-red-500">*</span>
      </label>
      <div class="bg-max-bg/30 rounded-xl p-3 border border-max-sec/20">
        <MaxCalendar
          v-model:departure-date="departureDate"
          v-model:return-date="returnDate"
        />
      </div>
      <div class="bg-max-special/20 rounded-lg p-3">
        <p class="text-xs font-sans-bold text-max-pri">
          💡 La date de retour est optionnelle pour un aller simple
        </p>
      </div>
    </div>

    <!-- Bouton de recherche -->
    <MaxButton class="w-full mt-2">
      <span class="flex items-center justify-center gap-2">
        <span>🚀</span>
        <span>Découvrir mes destinations</span>
      </span>
    </MaxButton>

    <!-- Mention obligatoire -->
    <p class="text-xs text-max-pri/60 text-center mt-1">
      <span class="text-red-500">*</span> Champs obligatoires
    </p>
  </form>
</template>

<script setup>
const { departureStation, destinationStation, departureDate, returnDate, research } = useSearchForm()
</script>

<style scoped>
</style>
