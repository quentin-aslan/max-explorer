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
        <p class="m-0">
          La liste de tout les trains pour l'aller ici :) Comming Soon, avec les changements
        </p>
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
}
</style>
