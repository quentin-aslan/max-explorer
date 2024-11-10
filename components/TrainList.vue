<template>
  <Tabs value="departure">
    <TabList>
      <Tab value="departure">
        Aller ({{ departureJourneys.length }})
      </Tab>
      <Tab
        v-if="isReturnTabDisplayed"
        value="return"
      >
        Retour ({{ returnJourneys.length }})
      </Tab>
    </TabList>
    <TabPanels class="z-10 w-full">
      <TabPanel value="departure">
        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-4">
            <Select
              v-model="sortChoice"
              :options="sortChoicesOptions"
              option-label="label"
              option-value="choice"
              placeholder="Select a City"
              class="w-full md:w-56"
            />
          </div>
          <TrainCard
            v-for="(journey, index) in departureJourneysSorted"
            :key="index"
            :journey="journey"
          />
        </div>
      </TabPanel>
      <TabPanel
        v-if="isReturnTabDisplayed"
        value="return"
      >
        <div class="flex flex-col gap-4">
          <TrainCard
            v-for="(journey, index) in returnJourneysSorted"
            :key="index"
            :journey="journey"
          />
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script lang="ts" setup>
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import type { Journey } from '~/types/common'

type Props = {
  departureJourneys: Journey[]
  returnJourneys: Journey[]
}

const props = defineProps<Props>()
const isReturnTabDisplayed = computed(() => props.returnJourneys.length > 0)

// SORT

const { calculateJourneyTotalDuration } = useDestinations()

enum SortChoices {
  DURATION_ASC = 'duration_asc',
  DURATION_DESC = 'duration_desc',
  DEPARTURE_TIME_ASC = 'departure_time_asc',
  DEPARTURE_TIME_DESC = 'departure_time_desc',
}

const sortChoicesOptions = [
  { label: 'Durée (croissant)', choice: SortChoices.DURATION_ASC },
  { label: 'Durée (décroissant)', choice: SortChoices.DURATION_DESC },
  { label: 'Heure de départ (croissant)', choice: SortChoices.DEPARTURE_TIME_ASC },
  { label: 'Heure de départ (décroissant)', choice: SortChoices.DEPARTURE_TIME_DESC },
]

const sortChoice = ref<SortChoices>(SortChoices.DURATION_ASC)

const departureJourneysSorted = computed(() => {
  if (sortChoice.value === SortChoices.DURATION_ASC) {
    return sortJourneysByDuration(props.departureJourneys, 'asc')
  }
  else if (sortChoice.value === SortChoices.DURATION_DESC) {
    return sortJourneysByDuration(props.departureJourneys, 'desc')
  }
  else if (sortChoice.value === SortChoices.DEPARTURE_TIME_ASC) {
    return sortJourneysByDepartureTime(props.departureJourneys, 'asc')
  }
  else if (sortChoice.value === SortChoices.DEPARTURE_TIME_DESC) {
    return sortJourneysByDepartureTime(props.departureJourneys, 'desc')
  }
  else {
    return sortJourneysByDuration(props.departureJourneys, 'asc')
  }
})

const returnJourneysSorted = computed(() => {
  if (sortChoice.value === SortChoices.DURATION_ASC) {
    return sortJourneysByDuration(props.returnJourneys, 'asc')
  }
  else if (sortChoice.value === SortChoices.DURATION_DESC) {
    return sortJourneysByDuration(props.returnJourneys, 'desc')
  }
  else if (sortChoice.value === SortChoices.DEPARTURE_TIME_ASC) {
    return sortJourneysByDepartureTime(props.returnJourneys, 'asc')
  }
  else if (sortChoice.value === SortChoices.DEPARTURE_TIME_DESC) {
    return sortJourneysByDepartureTime(props.returnJourneys, 'desc')
  }
  else {
    return sortJourneysByDuration(props.returnJourneys, 'asc')
  }
})

const sortJourneysByDuration = (journeys: Journey[], order: 'asc' | 'desc' = 'asc') => {
  return [...journeys].sort((a, b) => {
    const durationA = calculateJourneyTotalDuration(a)
    const durationB = calculateJourneyTotalDuration(b)
    return order === 'asc' ? durationA - durationB : durationB - durationA
  })
}

const sortJourneysByDepartureTime = (journeys: Journey[], order: 'asc' | 'desc' = 'asc') => {
  return [...journeys].sort((a, b) => {
    const departureTimeA = new Date(a.departureTime).getTime()
    const departureTimeB = new Date(b.departureTime).getTime()
    return order === 'asc' ? departureTimeA - departureTimeB : departureTimeB - departureTimeA
  })
}
</script>

<style scoped>
/* Non-active tab color */
:deep(.p-tab) {
  @apply font-sans-semibold;
  @apply border-max-bg;
  @apply text-max-sec;
}

:deep(.p-tab.p-tab-active) { /* Change active color */
  @apply text-max-pri;
}
:deep(.p-tablist-active-bar) { /* Customize the active bar (underline) for the active tab */
  @apply bg-max-pri;
}

:deep(.p-tablist-tab-list) { /* Remove the border color where there are no tabs anymore */
  @apply bg-max-bg;
  @apply border-max-bg;
}
:deep(.p-tabpanels) { /* Remove the white bg of tabpannels */
  @apply bg-max-bg;
  @apply p-0;
  @apply pt-4;
}
</style>
