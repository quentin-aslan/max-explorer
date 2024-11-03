import { ref } from 'vue'
import type { RoundTripDestination, Destination, GetDestinationCoordinatesResponse } from '~/types/common'

const destinations = ref<Destination[]>([])
const isFetchDestinationLoading = ref(false)

export const useDestinations = () => {
  const toast = useToast()

  const fetchDestinations = async (
    departureStation: string,
    destinationStation: string | undefined = undefined,
    departureDate: string,
    returnDate: string,
  ) => {
    try {
      isFetchDestinationLoading.value = true
      destinations.value = []

      const formattedDepartureDate = departureDate ? departureDate.toISOString().slice(0, 10) : ''
      const formattedReturnDate = returnDate ? returnDate.toISOString().slice(0, 10) : ''

      const { data } = await useFetch('/api/train-v2', {
        query: {
          origin: departureStation,
          destination: destinationStation,
          departureDate: formattedDepartureDate,
          returnDate: formattedReturnDate,
        },
      })

      const destinationsResponses = data.value as RoundTripDestination[]
      for (const destination of destinationsResponses) {
        if (destination.destinationName && destination.departureJourneys.length > 0 && destination.returnJourneys.length > 0) {
          const destinationWithCoordinates = await buildDestinationWithCoordinates(destination)
          destinations.value.push(destinationWithCoordinates)
        }
      }
    }
    catch (e) {
      console.error(e)
    }
    finally {
      isFetchDestinationLoading.value = false
    }
  }

  const buildDestinationWithCoordinates = async (destination: Destination): Promise<Destination> => {
    try {
      const { data } = await useFetch<GetDestinationCoordinatesResponse>('/api/get-destination-coordinates', {
        query: {
          destinationName: destination.destinationName,
        },
      })

      if (data) {
        return {
          ...destination,
          latitude: data.value.latitude,
          longitude: data.value.longitude,
        }
      }
    }
    catch (e) {
      console.error(e)
      toast.add({
        severity: 'error',
        summary: 'Erreur lors de la récupération des détails de la destination ' + destinationName,
        life: 5000,
      })
    }
  }

  return {
    fetchDestinations,
    isFetchDestinationLoading,
    destinations,
  }
}
