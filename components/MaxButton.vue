<template>
  <button
    type="submit"
    :disabled="disabled"
    class="text-white font-sans-semibold rounded-lg text-xl px-5 py-2.5 focus:outline-none"
    :class="{ 'bg-max-action hover:bg-max-action-hover': !disabled, 'bg-max-action/60': disabled }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
