import {ref} from "vue";

const departureStation = ref('Toulouse');
const destinationStation = ref('')
const departureDate = ref<Date | null>(null);
const returnDate = ref<Date | null>(null);

export const useSearchForm = () => {
    const { fetchTrains } = useTrains()
    const toast = useToast()

    const { startLoading, stopLoading} = useLoader()

    const research = async () => {

        if(!departureStation.value) {
            toast.add({
                severity: 'error',
                summary: "Gare de départ manquante !",
                life: 5000,
            })

            return
        }

        if(!departureDate.value) {
            toast.add({
                severity: 'error',
                summary: "Date de départ manquante !",
                life: 5000,
            })

            return
        }

        if(!returnDate.value) {
            toast.add({
                severity: 'error',
                summary: "Date de retour manquante !",
                life: 5000,
            })

            return
        }

        startLoading()
        await fetchTrains(departureDate.value, returnDate.value, departureStation.value, destinationStation.value)

        navigateTo('/results')
        stopLoading()
    }

    return {
        departureStation,
        destinationStation,
        departureDate,
        returnDate,
        research
    }
}