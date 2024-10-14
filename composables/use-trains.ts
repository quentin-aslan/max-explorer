import {ref} from "vue";
import type {City, Train} from "~/types";
import axios from "axios";

const departureTrains = ref<Train[]>([]);
const returnTrains = ref<Train[]>([]);
const cities = ref<City[]>([]);
const isFetchTrainsLoading = ref(false)

export const useTrains = () => {
    const fetchTrains = async (departureDate: string, returnDate: string, departureStation: string, destinationStation?: string) => {
        try {
            isFetchTrainsLoading.value = true;
            cities.value = [];
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

                const citiesNames = Array.from(
                    new Set([
                        ...departureTrains.value.map((t) => t.destination),
                    ])
                );

                await buildCitiesDetails(citiesNames);
            }

        } catch (e) {
            console.error(e)
        } finally {
            isFetchTrainsLoading.value = false;
        }
    }

    const buildCitiesDetails = async (citiesNames: string[]): Promise<City[]> => {
        for (const cityName of citiesNames) {
            try {
                const { data, status }: { data: City } = await axios.get('/api/get-city-coordinates', {
                    params: {
                        cityName: cityName
                    },
                })

                if(data) {
                    cities.value.push(data);
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    const getDepartureTrainsFromCity = (city: City) => {
        return departureTrains.value.filter((train) => train.destination === city.name);
    }

    const getReturnTrainsFromCity = (city: City) => {
        return returnTrains.value.filter((train) => train.origine === city.name);
    }

    return {
        departureTrains,
        returnTrains,
        cities,
        fetchTrains,
        getDepartureTrainsFromCity,
        getReturnTrainsFromCity,
        isFetchTrainsLoading
    }
}