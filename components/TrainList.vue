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
          <TrainCard
            v-for="(journey, index) in departureJourneys"
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
            v-for="(journey, index) in returnJourneys"
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
