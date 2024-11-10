import { ref } from 'vue'
import type { RoundTripDestination } from '~/types/common'
import { toISOStringWithOffset } from '~/utils'

const destinations = ref<RoundTripDestination[]>([])
const isFetchDestinationLoading = ref(false)

export const useDestinations = () => {
  const toast = useToast()

  const fetchDestinations = async (
    departureStation: string,
    destinationStation: string | undefined = undefined,
    departureDate: string,
    returnDate: string | undefined,
  ) => {
    try {
      isFetchDestinationLoading.value = true
      destinations.value = []
      const formattedDepartureDate = departureDate ? toISOStringWithOffset(departureDate).slice(0, 10) : undefined
      const formattedReturnDate = returnDate ? toISOStringWithOffset(returnDate).slice(0, 10) : undefined

      const { data } = await useFetch('/api/train-v2', {
        query: {
          origin: departureStation,
          destination: destinationStation,
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

  return {
    fetchDestinations,
    isFetchDestinationLoading,
    destinations,
  }
}
