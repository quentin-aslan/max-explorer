import small_tgvmax from '../mocks/small_tgvmax.json'
import axios from "axios";

interface Props {
    origin: string,
    departureDate: string,
    arrivalDate: string
}

interface Train {
    id: number
    date: Date
    train_no: string
    entity: string
    axe: string
    origine_iata: string
    destination_iata: string
    origine: string
    destination: string
    heure_depart: string
    heure_arrivee: string
    od_happy_card: string
}

interface ResponseFromSNCF {
    total_count: number,
    results: Train[]
}

const BASE_SNCF_API = 'https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tgvmax/records'


const fetchTrain = async (origin: string, date: string, offset: number, limit: number) : Promise<ResponseFromSNCF> => {
    console.log(`fetchTrain : ${origin} - date: ${date} - offset: ${offset}`)
    const where = `origine like "${origin}" and  \`date\`=date'${date}' and od_happy_card="OUI"`
    const order_by = `date ASC, heure_arrivee ASC`
    const { data, status } = await axios.get(BASE_SNCF_API, {
        params: {
            where,
            order_by,
            limit,
            offset
        },
    })

    return data
}

const searchTrainFromAPI = async (origin, date) => {
    if (!origin || !date) throw new Error('searchTrainFromAPI : props are missing')
    let allTrains: Train[] = []

    let totalCount: number = 0
    let offset = 0
    const limit = 100

    // First iteration, init totalCount and get the 100 first trains
    const data = await fetchTrain(origin, date, offset, limit)
    totalCount = data.total_count
    allTrains.push(...data.results)
    offset += limit

    let i  = 0
    while (offset < totalCount) {
        i++
        console.log('while', i)
        const _data = await fetchTrain(origin, date, offset, limit)
        offset += limit // 200
        allTrains.push(..._data.results)
    }

    return allTrains
}

export default defineEventHandler(async (event) => {
    const { origin, departureDate, arrivalDate }: Props = getQuery(event);

    if (!origin || !departureDate || !arrivalDate) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Origin, departure date and arrival date are required',
        })
    }

    try {
        const trains = await searchTrainFromAPI(origin, '2024-10-12')
        return trains
    } catch (e) {
        console.error(e)
        return []
    }

    // const trains: Train[] = small_tgvmax.results
    //
    // const trainsFiltered = trains.filter((train) => {
    //     const originFormated = train.origine.toLowerCase()
    //     return originFormated.includes(origin.toLowerCase())
    // })
    // return trainsFiltered;
});
