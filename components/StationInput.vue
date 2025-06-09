<template>
  <div class="relative">
    <input
      :id="domId"
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      class="block w-full px-4 py-3 font-sans-medium text-max-pri bg-white rounded-xl border-2 border-max-sec/30 placeholder:text-sm placeholder:lg:text-base placeholder:text-max-sec/60 placeholder:font-sans-medium focus:outline-none focus:border-max-action focus:ring-0 focus:shadow-lg transition-all duration-200"
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  placeholder: string
}>()

const inputValue = defineModel<string>()

const randomId = Math.floor(Math.random() * 1000)

const domId = computed(() => props.placeholder ?? randomId)
</script>

<style scoped>

</style>
