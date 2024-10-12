import {ref} from "vue";
import type {Train} from "~/types";

const departureTrains = ref<Train[]>([]);
const returnTrains = ref<Train[]>([]);
const citiesList = ref<string[]>([]);

export const useTrains = () => {
    const fetchTrains = async (departureDate: string, returnDate: string, departureStation: string, destinationStation?: string) => {
        const formattedDepartureDate = departureDate
            ? departureDate.toISOString().slice(0, 10)
            : '';
        const formattedReturnDate = returnDate
            ? returnDate.toISOString().slice(0, 10)
            : '';

        let fetchTrainsURL = `/api/trains?origin=${departureStation}&departureDate=${formattedDepartureDate}&returnDate=${formattedReturnDate}`;
        if (destinationStation) fetchTrainsURL+= `&destination=${destinationStation}`

        const { data } = await useFetch(fetchTrainsURL);

        if (data.value?.departureTrains && data.value?.returnTrains) {
            departureTrains.value = data.value.departureTrains;
            returnTrains.value = data.value.returnTrains;

            citiesList.value = Array.from(
                new Set([
                    ...departureTrains.value.map((t) => t.destination),
                ])
            );
        }
    };

    const getDepartureTrainsFromCity = (city: string) => {
        return departureTrains.value.filter((train) => train.destination === city);
    }

    const getReturnTrainsFromCity = (city: string) => {
        return returnTrains.value.filter((train) => train.origine === city);
    }

    return {
        departureTrains,
        returnTrains,
        citiesList,
        fetchTrains,
        getDepartureTrainsFromCity,
        getReturnTrainsFromCity
    }
}