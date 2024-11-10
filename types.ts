export interface Train {
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
