<template>
  <section
    v-if="isLoaderVisible"
    class="z-50 top-0 fixed flex items-center justify-center min-h-screen w-screen bg-white/60"
  >
    <ProgressSpinner />
  </section>
</template>

<script lang="ts" setup>
const { isLoaderVisible } = useLoader()
</script>
