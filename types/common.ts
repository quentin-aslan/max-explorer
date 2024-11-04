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

export interface GetDestinationCoordinatesResponse {
  name: string
  latitude: number
  longitude: number
}

export interface Destination extends RoundTripDestination {
  id: string
  distanceWithOrigin: number
  latitude: number
  longitude: number
}

export interface TrainStation {
  name: string
  traffic: number
  latitude: number
  longitude: number
}
