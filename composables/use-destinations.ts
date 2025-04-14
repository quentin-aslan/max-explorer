import { ref } from 'vue'
import type { Journey, RoundTripDestination } from '~/types/common'
import { toISOStringWithOffset } from '~/utils'

const destinations = ref<RoundTripDestination[]>([])
const isFetchDestinationLoading = ref(false)

export const useDestinations = () => {
  const toast = useToast()

  const fetchDestinations = async (
    departureStation: Date,
    destinationStation: string | undefined = undefined,
    departureDate: Date,
    returnDate: Date | undefined,
  ) => {
    try {
      isFetchDestinationLoading.value = true
      destinations.value = []
      const formattedDepartureDate = departureDate ? toISOStringWithOffset(departureDate).slice(0, 10) : undefined
      const formattedReturnDate = returnDate ? toISOStringWithOffset(returnDate).slice(0, 10) : undefined

      const { data } = await useFetch('/api/find-trips', {
        query: {
          origin: departureStation,
          destination: destinationStation,
          directOnly: true,
          departureDate: formattedDepartureDate,
          returnDate: formattedReturnDate,
        },
      })

      destinations.value = data.value as RoundTripDestination[]
    }
    catch (e) {
      console.error(e)
      toast.add({
        severity: 'error',
        summary: 'An error ocurred while fetching destinations',
        life: 5000,
      })
    }
    finally {
      isFetchDestinationLoading.value = false
    }
  }

  const calculateConnectionTime = (journey: Journey, index: number) => {
    if (index === 0) return 0

    return new Date(journey[index].departureDateTime) - new Date(journey[index - 1].arrivalDateTime)
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

  return {
    fetchDestinations,
    isFetchDestinationLoading,
    destinations,
    calculateJourneyTotalDuration,
    calculateConnectionTime,
  }
}
