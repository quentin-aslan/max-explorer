<template>
  <div class="h-full min-h-screen bg-max-bg">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toast class="z-50" />
    <TheLoader />
  </div>
</template>

<script setup lang="ts">
import { GetTrainStationsUseCase } from '~/domains/train-stations/get-train-stations.use-case'
import { TrainStationsRepositoryNuxt } from '~/domains/train-stations/adapters/train-stations.repository.nuxt'
import type { TrainStation } from '~/domains/train-stations/entities/train-station'
import { TrainStationsPresenterImpl } from '~/domains/train-stations/adapters/train-stations.presenter.impl'

const trainStations = ref<TrainStation[]>()
const getTrainStationsUseCase = new GetTrainStationsUseCase(new TrainStationsRepositoryNuxt())
getTrainStationsUseCase.execute(new TrainStationsPresenterImpl(vm => trainStations.value = vm))
</script>
