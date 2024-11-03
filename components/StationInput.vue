<template>
  <div class="relative">
    <input
      :id="domId"
      v-model="inputValue"
      type="text"
      class="block px-5 pb-3 pt-5 w-full font-sans-semibold text-max-pri bg-white rounded-lg border border-max-sec appearance-none
             dark:text-white focus:outline-none focus:ring-0 focus:border-max-pri peer"
      placeholder=""
    >
    <label
      :for="domId"
      class="absolute start-5 text-max-sec font-sans-semibold text-xl duration-300
      transform-translate-y-4 scale-50 top-0 z-10 origin-[0] peer-placeholder-shown:scale-100
      peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4"
    >
      {{ placeholder }}</label>
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
