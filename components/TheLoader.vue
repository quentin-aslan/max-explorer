<template>
  <section
    v-if="isLoaderVisible"
    class="z-50 top-0 fixed flex flex-col items-center justify-center text-center  min-h-screen w-screen bg-white/60"
  >
    <ProgressSpinner />
    {{ messageDisplayed }}
  </section>
</template>

<script lang="ts" setup>
const { isLoaderVisible, messageDisplayed } = useLoader()
</script>
