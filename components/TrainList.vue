<template>
  <div class="space-y-6">
    <!-- Tabs simples et élégantes -->
    <Tabs
      value="departure"
      class="w-full"
    >
      <TabList class="bg-transparent border-b-2 border-max-sec/20">
        <Tab
          value="departure"
          class="flex items-center space-x-2 px-4 py-3 font-sans-bold text-lg transition-all duration-200"
        >
          <span>🚀</span>
          <span>Aller</span>
          <span class="bg-max-action text-white px-2 py-1 rounded-full text-xs font-sans-bold ml-2">
            {{ departureJourneys.length }}
          </span>
        </Tab>
        <Tab
          v-if="isReturnTabDisplayed"
          value="return"
          class="flex items-center space-x-2 px-4 py-3 font-sans-bold text-lg transition-all duration-200"
        >
          <span>🔄</span>
          <span>Retour</span>
          <span class="bg-max-special text-white px-2 py-1 rounded-full text-xs font-sans-bold ml-2">
            {{ returnJourneys.length }}
          </span>
        </Tab>
      </TabList>

      <TabPanels class="mt-6">
        <TabPanel value="departure">
          <TrainListContent
            :journeys="departureJourneys"
            title="Trains aller"
          />
        </TabPanel>
        <TabPanel
          v-if="isReturnTabDisplayed"
          value="return"
        >
          <TrainListContent
            :journeys="returnJourneys"
            title="Trains retour"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'

interface Props {
  departureJourneys: JourneyViewModel[]
  returnJourneys: JourneyViewModel[]
}

const props = defineProps<Props>()
const isReturnTabDisplayed = computed(() => props.returnJourneys.length > 0)
</script>

<style scoped>
/* Tabs styling épuré */
:deep(.p-tab) {
  @apply font-sans-semibold text-max-sec hover:text-max-pri transition-all duration-200;
}

:deep(.p-tab.p-tab-active) {
  @apply text-max-pri;
}

:deep(.p-tablist-active-bar) {
  @apply bg-max-action;
  height: 3px;
  border-radius: 2px;
}
</style>
