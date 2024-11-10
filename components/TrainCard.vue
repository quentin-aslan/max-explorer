<template>
  <div class="bg-max-bg border border-max-sec rounded-lg p-4 shadow-sm space-y-4">
    <!-- Header: Travel Duration -->
    <div class="flex items-center text-max-pri font-sans">
      <i class="pi pi-clock mr-2" /> <!-- Clock Icon -->
      <span>{{ totalDuration }}</span>
    </div>

    <!-- Direct Journey -->
    <div
      v-if="isDirectTrip"
      class="space-y-2"
    >
      <TrainSegment
        :train="trainSegments[0]"
        :is-last="true"
      />
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <!-- First Train -->
      <TrainSegment
        :train="trainSegments[0]"
        :is-last="false"
      />

      <!-- Vertical line -->
      <div class="relative">
        <div
          class="absolute bg-max-sec"
          style="width: 2px; height: 5.5rem; top: -2.5rem; left: 0.98rem;"
        />
      </div>

      <!-- Connection Info -->
      <div class="px-4 py-1 w-fit bg-max-action rounded-md left-12 relative">
        <p class="text-max-pri font-sans-medium text-xs">
          Changement à {{ connectionStation }}<br>
          {{ connectionTime }} - {{ connectionEndTime }} ({{ connectionDuration }})
        </p>
      </div>

      <!-- Second Train -->
      <TrainSegment
        :train="trainSegments[1]"
        :is-last="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import TrainSegment from './TrainSegment.vue'

const props = defineProps({
  isDirectTrip: { type: Boolean, required: true },
  totalDuration: { type: String, required: true },
  trainSegments: {
    type: Array,
    required: true,
  },
  connectionStation: { type: String, required: false },
  connectionTime: { type: String, required: false },
  connectionEndTime: { type: String, required: false },
  connectionDuration: { type: String, required: false },
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>
