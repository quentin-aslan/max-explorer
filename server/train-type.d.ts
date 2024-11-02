export interface ApiResponseTrains {
  date: string
  train_no: string
  entity: string
  axe: string
  origine_iata: string
  destination_iata: string
  origine: string
  destination: string
  heure_depart: string
  heure_arrivee: string
  od_happy_card: 'OUI' | 'NON'
}

export interface AdaptedTrainData {
  date: string
  trainNo: string
  entity: string
  axe: string
  originIata: string
  destinationIata: string
  origin: string
  destination: string
  departureDateTime: Date
  arrivalDateTime: Date
  isEligibleForMaxSubscription: boolean
}

export interface RoundTripDestination {
  destinationName: string
  departureJourneys: Journey
  returnJourneys: Journey
}

export type Journey = AdaptedTrainData[][]

export interface DestinationJourneys {
  destinationName: string
  journeys: Journey
}
