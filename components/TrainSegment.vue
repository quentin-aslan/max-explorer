<template>
  <div class="flex items-start space-x-4 relative">
    <!-- Train Icon Container (Smaller Black Circle) -->
    <div class="flex items-center justify-center w-8 h-8 bg-max-pri rounded-full">
      <!-- Inline SVG Icon, smaller inside the circle -->
      <div
        class="text-white"
        v-html="trainIcon"
      />
    </div>

    <!-- Vertical line -->
    <div
      v-if="isLast"
      class="absolute bg-max-sec"
      style="width: 2px; height: 2.8rem; bottom: 2rem; left: -0.04rem;"
    />

    <!-- Train Details -->
    <div>
      <div class="text-xl text-max-pri font-sans-semibold">
        {{ train.trainNumber }}
      </div>
      <div class="text-sm text-max-pri">
        {{ train.startStation }}
      </div>
      <div class="text-sm text-max-pri font-sans-medium">
        {{ train.startTime }}
      </div>

      <!-- End Station -->
      <div
        v-if="isLast"
        class="relative items-center space-x-2 mt-2"
      >
        <div class="flex ">
          <span
            class="w-2 h-2 rounded-full bg-max-pri"
            style="position: absolute; top: 1rem; left: -2.24rem;"
          /> <!-- Dot for end station -->
          <div>
            <div class="text-sm text-max-pri">
              {{ train.endStation }}
            </div>
            <div class="text-sm text-max-pri font-sans-medium">
              {{ train.endTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import trainIcon from 'assets/icons/train.svg?raw'

const props = defineProps({
  train: {
    type: Object,
    required: true,
  },
  isLast: { type: Boolean, default: true },
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>
