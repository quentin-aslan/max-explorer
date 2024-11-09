import { ref } from 'vue'

const departureStation = ref('')
const destinationStation = ref('')
const departureDate = ref<Date | null>(null)
const returnDate = ref<Date | null>(null)

export const useSearchForm = () => {
  const toast = useToast()

  const setDestinationStation = (city: string) => {
    destinationStation.value = city
  }

  const research = async () => {
    if (!departureStation.value) {
      toast.add({
        severity: 'error',
        summary: 'Gare de départ manquante !',
        life: 5000,
      })

      return
    }

    if (!departureDate.value) {
      toast.add({
        severity: 'error',
        summary: 'Date de départ manquante !',
        life: 5000,
      })

      return
    }

    if (!returnDate.value) {
      toast.add({
        severity: 'error',
        summary: 'Date de retour manquante !',
        life: 5000,
      })

      return
    }
    navigateTo({
      path: '/results',
      query: {
        departureStation: departureStation.value,
        destinationStation: destinationStation.value,
        departureDate: departureDate.value,
        returnDate: returnDate.value,
      },
    })
  }

  const initFormValue = (newDepartureStation, newDestinationStation, newDepartureDate, newReturnDate) => {
    if (newDepartureStation) departureStation.value = newDepartureStation
    if (newDestinationStation) destinationStation.value = newDestinationStation
    if (newDepartureDate) departureDate.value = newDepartureDate
    if (newReturnDate) returnDate.value = newReturnDate
  }

  return {
    departureStation,
    destinationStation,
    departureDate,
    returnDate,
    research,
    initFormValue,
    setDestinationStation: (city: string) => destinationStation.value = city,
  }
}
