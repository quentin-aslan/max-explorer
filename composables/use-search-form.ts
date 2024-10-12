import {ref} from "vue";

const departureStation = ref('Toulouse');
const destinationStation = ref('')
const departureDate = ref<Date | null>(null);
const returnDate = ref<Date | null>(null);

export const useSearchForm = () => {
    const { fetchTrains } = useTrains()

    const { startLoading, stopLoading} = useLoader()

    const research = async () => {
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