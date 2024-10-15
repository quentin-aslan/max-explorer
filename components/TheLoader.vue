<template>
  <section
      v-if="isLoaderVisible"
      class="z-40 fixed flex items-center justify-center h-screen w-screen bg-white/60"
  >
    <ProgressSpinner />
  </section>
</template>

<script lang="ts" setup>
const { isLoaderVisible } = useLoader()
</script>
