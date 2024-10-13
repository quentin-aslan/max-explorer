export interface Train {
    id: number;
    date: Date;
    train_no: string;
    entity: string;
    axe: string;
    origine_iata: string;
    destination_iata: string;
    origine: string;
    destination: string;
    heure_depart: string;
    heure_arrivee: string;
    od_happy_card: string;
}

export interface City {
    id: string,
    name: string,
    distanceWithOrigin: number,
    google_place_id: string,
    latitude: number,
    longitude: number
}

export type MapsFrame = {
    minLatitude: number
    minLongitude: number
    maxLatitude: number
    maxLongitude: number
}

export type Coordinates = {
    latitude: number
    longitude: number
}
