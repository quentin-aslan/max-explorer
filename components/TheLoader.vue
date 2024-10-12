<template>
  <section
      v-if="isLoaderVisible"
      class="z-40 fixed flex items-center justify-center h-screen w-screen bg-white/60"
  >
    <span class="loading loading-dots loading-lg"></span>
  </section>
</template>

<script lang="ts" setup>
const { isLoaderVisible } = useLoader()
</script>
