<template>
  <div class="flex flex-col gap-4 bg-max-bg border border-max-sec rounded-lg p-4 shadow-sm duration-150 hover:border-max-action group">
    <!-- Header: Travel Duration -->
    <div class="flex flex-row items-center">
      <i class="pi pi-clock mr-2" />
      <span>Durée total du trajet : <span class="font-sans-semibold tracking-wider border-b-4 border-b-max-action">
        {{ prettifyMinToH(journey.journeyTotalDurationMinutes) }}
      </span></span>
    </div>

    <div class="space-y-4 sm:flex sm:flex-row sm:items-center">
      <div>
        <div
          v-for="(train, index) in journey.trains"
          :key="index"
        >
          <TrainSegment
            :train="train"
            :is-last="index === journey.trains.length - 1"
          />

          <template v-if="index < journey.trains.length - 1">
            <!-- Vertical line -->
            <div class="relative">
              <div
                class="absolute bg-max-sec"
                style="width: 2px; height: 5.5rem; top: -1rem; left: 0.96rem;"
              />
            </div>
            <!-- Connection Info -->
            <div class="p-2 ml-12 mt-2 w-fit bg-max-action rounded-md relative">
              <p class="text-max-pri font-sans-medium text-xs">
                Changement à <span class="font-sans-semibold">{{ journey.trains[index+1].origin }}</span><br>
                {{ train.arrivalDateTime.toFormat('HH:mm') }} - {{ journey.trains[index+1].departureDateTime.toFormat('HH:mm') }} ({{ prettifyMinToH(journey.connectionDurationMinutes) }})
              </p>
            </div>
          </template>
        </div>
      </div>

      <div
          class="flex flex-col ml-auto"
          :class="[
             isJourneyWithConnection ? 'sm:gap-12' : '',
             'lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto'
           ]"
      >
        <MaxButton
          v-for="(train, index) in journey.trains"
          :key="index"
          class="!text-base"
          @click="() => bookTheTrain(train)"
        >
          {{ (!isJourneyWithConnection)
            ? 'Réserver le train sur sncf-connect'
            : `Réserver le train n&deg ${index+1} sur sncf-connect` }}
        </MaxButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import TrainSegment from './TrainSegment.vue'
import { prettifyMinToH } from '~/utils'
import type { JourneyViewModel } from '~/domains/trips/entities/view-models/journey.view-model'
import type { TrainViewModel } from '~/domains/trips/entities/view-models/train.view-model'
import { BookTrainUseCase } from '~/domains/book-train/book-train.use-case'

type Props = {
  journey: JourneyViewModel
}

const props = defineProps<Props>()

const isJourneyWithConnection = computed(() => props.journey.trains.length > 1)

const bookTheTrain = async (train: TrainViewModel) => {
  const bookTrainUseCase = new BookTrainUseCase(train)
  const url = bookTrainUseCase.execute()
  await navigateTo(url, {
    external: true,
    open: {
      target: '_blank',
    },
  })
}
</script>
