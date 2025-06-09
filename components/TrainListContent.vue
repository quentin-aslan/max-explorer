<template>
  <div class="space-y-4">
    <!-- Barre de tri moderne -->
    <div class="flex items-center justify-between bg-max-bg/50 rounded-xl p-4">
      <div class="flex items-center space-x-3">
        <span class="text-sm font-sans-semibold text-max-pri">Trier par :</span>
        <Select
          v-model="sortChoice"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          placeholder="Choisir un tri"
          class="w-full md:w-56"
          :pt="{
            root: { class: '!rounded-lg !border-max-sec/30' },
            input: { class: '!py-2 !px-3 !text-sm' },
          }"
        />
      </div>
      <div class="text-right">
        <p class="text-sm font-sans-bold text-max-action">
          {{ journeysSorted.length }} résultat{{ journeysSorted.length > 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- Liste des trains -->
    <div class="space-y-4">
      <TrainCard
        v-for="(journey, index) in journeysSorted"
        :key="`${title}-${index}`"
        :journey="journey"
        class="transform transition-all duration-200 hover:-translate-y-1"
      />
    </div>

    <!-- Message si aucun train -->
    <div
      v-if="journeysSorted.length === 0"
      class="text-center py-8"
    >
      <div class="text-4xl mb-3">
        🤔
      </div>
      <h3 class="text-lg font-sans-bold text-max-pri mb-2">
        Aucun train trouvé
      </h3>
      <p class="text-max-pri/70 text-sm">
        Il n'y a pas de trains disponibles pour cette direction
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Select from 'primevue/select'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'

interface Props {
  journeys: JourneyViewModel[]
  title: string
}

interface SortOption {
  label: string
  value: SortChoice
}

enum SortChoice {
  DURATION_ASC = 'duration_asc',
  DURATION_DESC = 'duration_desc',
  DEPARTURE_TIME_ASC = 'departure_time_asc',
  DEPARTURE_TIME_DESC = 'departure_time_desc',
}

const props = defineProps<Props>()
const emit = defineEmits<{
  sortChanged: [choice: SortChoice]
}>()

const sortChoice = ref<SortChoice>(SortChoice.DURATION_ASC)

const sortOptions: SortOption[] = [
  { label: '⚡ Durée (plus court)', value: SortChoice.DURATION_ASC },
  { label: '🐌 Durée (plus long)', value: SortChoice.DURATION_DESC },
  { label: '🌅 Départ (plus tôt)', value: SortChoice.DEPARTURE_TIME_ASC },
  { label: '🌙 Départ (plus tard)', value: SortChoice.DEPARTURE_TIME_DESC },
]

const journeysSorted = computed(() => {
  const journeys = [...props.journeys]

  switch (sortChoice.value) {
    case SortChoice.DURATION_ASC:
      return journeys.sort((a, b) => a.journeyTotalDurationMinutes - b.journeyTotalDurationMinutes)
    case SortChoice.DURATION_DESC:
      return journeys.sort((a, b) => b.journeyTotalDurationMinutes - a.journeyTotalDurationMinutes)
    case SortChoice.DEPARTURE_TIME_ASC:
      return journeys.sort((a, b) => a.trains[0].departureDateTime.toMillis() - b.trains[0].departureDateTime.toMillis())
    case SortChoice.DEPARTURE_TIME_DESC:
      return journeys.sort((a, b) => b.trains[0].departureDateTime.toMillis() - a.trains[0].departureDateTime.toMillis())
    default:
      return journeys
  }
})

// Émettre le changement de tri au parent
watch(sortChoice, (newChoice) => {
  emit('sortChanged', newChoice)
})
</script>

<style scoped>
/* Style pour le select de tri */
:deep(.p-select) {
  @apply !rounded-lg !border-max-sec/30 !shadow-sm hover:!border-max-action/50 transition-all duration-200;
}

:deep(.p-select-label) {
  @apply !py-2 !px-3 !text-sm !font-sans-medium;
}

:deep(.p-select-overlay) {
  @apply !rounded-lg !border-max-sec/20 !shadow-lg;
}

:deep(.p-select-option) {
  @apply !py-3 !px-4 hover:!bg-max-bg !transition-colors !duration-200;
}
</style>
