<template>
  <Tabs value="go">
    <TabList>
      <Tab value="go">
        Aller
      </Tab>
      <Tab value="return">
        Retour
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="go">
        <TrainCard
          :is-direct-trip="true"
          total-duration="2h20"
          :train-segments="[{ trainNumber: 'TGV 5001', startStation: 'Paris Gare de Lyon', startTime: '09:00', endStation: 'Marseille St-Charles', endTime: '11:20' }]"
        />

        <div class="m-2" />

        <TrainCard
          :is-direct-trip="false"
          total-duration="4h30"
          :train-segments="[
            { trainNumber: 'TGV 6513', startStation: 'Paris Gare de Lyon', startTime: '10:45', endStation: 'Lyon-Part-Dieu', endTime: '12:17' },
            { trainNumber: 'TGV 8910', startStation: 'Lyon-Part-Dieu', startTime: '13:00', endStation: 'Marseille St-Charles', endTime: '15:15' },
          ]"
          connection-station="Lyon-Part-Dieu"
          connection-time="12:17"
          connection-end-time="13:00"
          connection-duration="43m"
        />
      </TabPanel>
      <TabPanel value="return">
        <p class="m-0">
          La liste de tout les trains retour ici
        </p>
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
  @apply max-w-screen-sm;
}
</style>
