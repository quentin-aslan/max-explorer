// SQLite does not support the Date type, so we use string instead
export type TrainPostgres = {
  date: string
  trainNo: string
  entity: string | null
  axe: string | null
  originIata: string
  destinationIata: string
  origin: string
  destination: string
  departureDateTime: string
  arrivalDateTime: string
  isEligibleForMaxSubscription: boolean
}
