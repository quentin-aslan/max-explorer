<template>
  <div class="flex flex-col gap-4 bg-max-bg border border-max-sec rounded-lg p-4 shadow-sm">
    <!-- Header: Travel Duration -->
    <div class="flex flex-row items-center text-max-pri font-sans">
      <i class="pi pi-clock mr-2" /> <!-- Clock Icon -->
      <span>{{ msToTime(totalDuration) }}</span>
    </div>
    <div
      class="space-y-4"
    >
      <div
        v-for="(train, index) in journey"
        :key="index"
      >
        <TrainSegment
          :train="train"
          :is-last="index === journey.length - 1"
        />

        <template v-if="index < journey.length - 1">
          <!-- Vertical line -->
          <div class="relative">
            <div
              class="absolute bg-max-sec"
              style="width: 2px; height: 5.5rem; top: -2.5rem; left: 0.98rem;"
            />
          </div>

          <!-- Connection Info -->
          <div class="p-2 ml-12 mt-2 w-fit bg-max-action rounded-md relative">
            <p class="text-max-pri font-sans-medium text-xs">
              Changement à {{ journey[index+1].origin }}<br>
              {{ formattedTime(train.arrivalDateTime) }} - {{ formattedTime(journey[index+1].departureDateTime) }} ({{ msToTime(calculateConnectionTime(journey, index+1)) }})
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import TrainSegment from './TrainSegment.vue'
import type { Journey } from '~/types/common'
import { formattedTime, msToTime } from '~/utils'

type Props = {
  journey: Journey
}

const props = defineProps<Props>()

const isDirectJourney = props.journey?.length === 1

const calculateConnectionTime = (journey: Journey, index: number) => {
  if (index === 0) return 0

  return new Date(journey[index].departureDateTime) - new Date(journey[index - 1].departureDateTime)
}

// Calculate the total duration of the journey
const calculateJourneyTotalDuration = (journey: Journey) => {
  let totalDuration = 0 // ms

  for (let i = 0; i < journey.length; i++) {
    const connectionTime = calculateConnectionTime(journey, i)
    const journeyDuration = new Date(journey[i].arrivalDateTime) - new Date(journey[i].departureDateTime)
    totalDuration += journeyDuration + connectionTime
  }

  return totalDuration
}

const totalDuration = calculateJourneyTotalDuration(props.journey)

// const props = defineProps({
//   isDirectTrip: { type: Boolean, required: true },
//   totalDuration: { type: String, required: true },
//   trainSegments: {
//     type: Array,
//     required: true,
//   },
//   connectionStation: { type: String, required: false },
//   connectionTime: { type: String, required: false },
//   connectionEndTime: { type: String, required: false },
//   connectionDuration: { type: String, required: false },
// })
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>
