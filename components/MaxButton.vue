<template>
  <button
    type="submit"
    class="text-white bg-max-action font-sans-semibold rounded-lg text-xl px-5 py-2.5 focus:outline-none"
  >
    {{ buttonName }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  buttonName: string
}>()
</script>

<style scoped>

</style>
