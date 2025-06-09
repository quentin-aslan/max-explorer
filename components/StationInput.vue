<template>
  <div class="relative">
    <input
      :id="domId"
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      class="block w-full px-4 py-3 pr-12 font-sans-medium text-max-pri bg-white rounded-xl border-2 border-max-sec/30 placeholder:text-sm placeholder:lg:text-base placeholder:text-max-sec/60 placeholder:font-sans-medium focus:outline-none focus:border-max-action focus:ring-0 focus:shadow-lg transition-all duration-200"
    >

    <!-- Bouton de suppression -->
    <button
      v-if="inputValue && inputValue.length > 0"
      type="button"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-max-sec/20 hover:bg-max-sec/30 rounded-full flex items-center justify-center transition-colors duration-200 group"
      @click="clearInput"
    >
      <i class="pi pi-times text-xs text-max-sec group-hover:text-max-pri" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  placeholder: string
}>()

const inputValue = defineModel<string>()

const randomId = Math.floor(Math.random() * 1000)

const domId = computed(() => props.placeholder ?? randomId)

const clearInput = () => {
  inputValue.value = ''
}
</script>

<style scoped>

</style>
