import { ref } from 'vue'
import { DateTime } from 'luxon'
import { FindTripsUseCase } from '~/domains/trips/find-trips.use-case'
import { TripsRepositoryNuxt } from '~/domains/trips/adapters/trips.repository.nuxt'
import { TripsPresenterImpl } from '~/domains/trips/adapters/trips.presenter.impl'
import type { TripViewModel } from '~/domains/trips/entities/view-models/trip.view-model'

const trips = ref<TripViewModel[]>([])
const isFetchTripsLoading = ref(false)

export const useFindTrips = () => {
  const toast = useToast()
  const error = ref<string | undefined>()

  watch(error, (val) => {
    if (val) {
      toast.add({
        severity: 'error',
        summary: val,
        life: 5000,
      })
    }
  })

  const fetchTrips = async (
    departureStation: string,
    destinationStation: string | undefined = undefined,
    departureDate: Date,
    returnDate: Date | undefined,
  ) => {
    isFetchTripsLoading.value = true
    trips.value = []
    error.value = undefined

    const findTripsUseCase = new FindTripsUseCase(
      new TripsRepositoryNuxt(),
      new TripsPresenterImpl(vm => trips.value = vm, vmError => error.value = vmError),
    )

    await findTripsUseCase.execute({
      origin: departureStation,
      departureDate: DateTime.fromJSDate(departureDate),
      directOnly: false,
      returnDate: (returnDate) ? DateTime.fromJSDate(returnDate) : undefined,
      destination: destinationStation,
    })

    isFetchTripsLoading.value = false
  }

  return {
    fetchTrips,
    isFetchTripsLoading,
    trips,
  }
}
