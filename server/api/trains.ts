import axios from "axios";
import mock_toulouse from "../mocks/mock_toulouse.json"

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

const fetchTrainBuildWhereWithoutDestination = (date: string, origin?: string, destination?: string) => {
    let where = ''
    if (origin) {
        where = `origine like "${origin}" and \`date\`=date'${date}' and od_happy_card="OUI"`
    } else if (destination) {
        where = `destination like "${destination}" and \`date\`=date'${date}' and od_happy_card="OUI"`
    }
    return where
}

const fetchTrainBuildWhere = (date: string, origin: string, destination: string) => {
    return `origine like "${origin}" and destination like "${destination}" and \`date\`=date'${date}' and od_happy_card="OUI"`
}

const fetchTrain = async (where:string, offset: number, limit: number) : Promise<ResponseFromSNCF> => {
    try {
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
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

const getTrains = async (where: string) => {
    console.log('getTrains, where : ', where)
    let allTrains: Train[] = []

    let totalCount: number = 0
    let offset = 0
    const limit = 100

    // First iteration, init totalCount and get the 100 first trains
    const data = await fetchTrain(where, offset, limit)
    totalCount = data.total_count
    allTrains.push(...data.results)
    offset += limit

    let i  = 0
    while (offset < totalCount) {
        i++
        console.log('while', i)
        const _data = await fetchTrain(where, offset, limit)
        offset += limit // 200
        allTrains.push(..._data.results)
    }

    return allTrains
}

const isValidTrips = (departureTrains: Train[], returnTrains: Train[]) => {
    const validDepartureTrains: Train[] = [];
    const validReturnTrains: Train[] = [];

    // Créer un Set avec les destinations des trains de départ
    const departureDestinationsSet = new Set(departureTrains.map(train => train.destination));

    // Créer un Set avec les origines des trains de retour
    const returnOriginsSet = new Set(returnTrains.map(train => train.origine));

    // Filtrer les trains de départ qui ont un retour possible
    departureTrains.forEach(departureTrain => {
        if (returnOriginsSet.has(departureTrain.destination)) {
            validDepartureTrains.push(departureTrain);
        }
    });

    // Filtrer les trains de retour qui ont un départ possible
    returnTrains.forEach(returnTrain => {
        if (departureDestinationsSet.has(returnTrain.origine)) {
            validReturnTrains.push(returnTrain);
        }
    });

    return {
        departureTrains: validDepartureTrains,
        returnTrains: validReturnTrains
    };
};

const searchRoundTrips = async (date: string, returnDate: string, origin, destination?: string) => {
    // RETURN
    if (!origin || !date) throw new Error('searchTrainFromAPI : props are missing')

    let whereDeparture;
    let whereReturn;

    if (destination) {
        whereDeparture = fetchTrainBuildWhere(date, origin, destination)
        whereReturn = fetchTrainBuildWhere(returnDate, destination, origin)
    } else {
        whereDeparture = fetchTrainBuildWhereWithoutDestination(date, origin)
        whereReturn = fetchTrainBuildWhereWithoutDestination(returnDate, undefined, origin)
    }

    const allDepartureTrains = await getTrains(whereDeparture)
    const allReturnTrains = await getTrains(whereReturn)

    const { departureTrains, returnTrains } = isValidTrips(allDepartureTrains, allReturnTrains)

    return {
        departureTrains,
        returnTrains
    }

}

export default defineEventHandler(async (event) => {
    const { origin, destination,  departureDate, returnDate }: Props = getQuery(event);

    const useMock =  false
    if(useMock) return mock_toulouse

    if (!origin || !departureDate || !returnDate) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Origin, departure date and return date are required',
        })
    }

    try {
        return await searchRoundTrips(departureDate, returnDate, origin, destination)
    } catch (e) {
        console.error(e)
        return []
    }
});
