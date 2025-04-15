import { ref } from 'vue'
import { DateTime } from 'luxon'
import { FindTripsUseCase } from '~/domains/trips/find-trips.use-case'
import { TripsRepositoryNuxt } from '~/domains/trips/adapters/trips.repository.nuxt'
import { TripsPresenterImpl } from '~/domains/trips/adapters/trips.presenter.impl'
import type { TripViewModel } from '~/domains/trips/entities/trip.view-model'
import type { TrainViewModel } from '~/domains/trips/entities/train.view-model'

const destinations = ref<TripViewModel[]>([])
const isFetchDestinationLoading = ref(false)

export const useDestinations = () => {
  const toast = useToast()

  const fetchDestinations = async (
    departureStation: string,
    destinationStation: string | undefined = undefined,
    departureDate: Date,
    returnDate: Date | undefined,
  ) => {
    isFetchDestinationLoading.value = true
    destinations.value = []

    const findTripsUseCase = new FindTripsUseCase(
      new TripsRepositoryNuxt(),
      new TripsPresenterImpl(vm => destinations.value = vm, toast),
    )

    await findTripsUseCase.execute({
      origin: departureStation,
      departureDate: DateTime.fromJSDate(departureDate),
      directOnly: false,
      returnDate: (returnDate) ? DateTime.fromJSDate(returnDate) : undefined,
      destination: destinationStation,
    })

    isFetchDestinationLoading.value = false
  }

  const calculateConnectionTime = (journey: TrainViewModel[], index: number) => {
    // TODO: To move in the presenter (JourneyType must be created)
    if (index === 0) return 0

    const departureTime = journey[index].departureDateTime
    const arrivalTime = journey[index - 1].arrivalDateTime
    return Math.round(departureTime.diff(arrivalTime, 'minutes').minutes)
  }
  // Calculate the total duration of the journey
  const calculateJourneyTotalDuration = (journey: TrainViewModel[]): number => {
    if (journey.length === 0) return 0

    const firstDeparture = journey[0].departureDateTime
    const lastArrival = journey[journey.length - 1].arrivalDateTime

    const totalDuration = lastArrival.diff(firstDeparture, 'minutes').minutes

    return Math.round(totalDuration)
  }

  return {
    fetchDestinations,
    isFetchDestinationLoading,
    destinations,
    calculateJourneyTotalDuration,
    calculateConnectionTime,
  }
}
