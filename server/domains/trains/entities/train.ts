import type { DateTime } from 'luxon'

export interface Train {
  date: DateTime
  trainNo: string
  entity: string | null
  axe: string | null
  originIata: string
  destinationIata: string
  origin: string
  destination: string
  departureDateTime: DateTime
  arrivalDateTime: DateTime
  isEligibleForMaxSubscription: boolean
}
