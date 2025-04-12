export type Train = {
  date: Date
  trainNo: string
  entity: string | null
  axe: string | null
  originIata: string
  destinationIata: string
  origin: string
  destination: string
  departureDateTime: Date
  arrivalDateTime: Date
  isEligibleForMaxSubscription: boolean
}
