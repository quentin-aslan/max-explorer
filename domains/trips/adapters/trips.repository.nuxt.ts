import { FetchError } from 'ofetch'
import { DateTime } from 'luxon'
import type { FindTripsParameters, TripsRepository } from '~/domains/trips/ports/trips.repository'
import type { Trip as TripTypeFromServer } from '~/server/domains/trips/entities/Trip'
import type { Trip } from '~/domains/trips/entities/trip'

export class TripsRepositoryNuxt implements TripsRepository {
  private readonly API_ENDPOINT = '/api/find-trips'

  public async findTrips(params: FindTripsParameters): Promise<Trip[]> {
    try {
      const { data, error } = await useFetch<TripTypeFromServer[]>(this.API_ENDPOINT, {
        query: this.sanitizeParams(params),
        retry: 3,
        timeout: 20000, // 20sc
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (error.value) {
        throw this.handleError(error.value)
      }

      if (!data.value) {
        return []
      }

      return this.mapTrips(data.value)
    }
    catch (e) {
      throw this.handleError(e)
    }
  }

  private sanitizeParams(params: FindTripsParameters): Record<string, string | boolean | undefined> {
    return {
      origin: params.origin?.trim(),
      directOnly: params.directOnly,
      departureDate: params.departureDate.toString(),
      destination: params.destination?.trim(),
      returnDate: params.returnDate?.toString(),
    }
  }

  private mapTrips(data: TripTypeFromServer[]): Trip[] {
    return data.map(trip => ({
      ...trip,
      departureJourneys: trip.departureJourneys.map(journey => journey.map(train => ({
        ...train,
        date: DateTime.fromISO((train.date as unknown as string)),
        departureDateTime: DateTime.fromISO((train.departureDateTime as unknown as string)),
        arrivalDateTime: DateTime.fromISO((train.arrivalDateTime as unknown as string)),
      }))),
      returnJourneys: trip.returnJourneys.map(journey => journey.map(train => ({
        ...train,
        date: DateTime.fromISO((train.date as unknown as string)),
        departureDateTime: DateTime.fromISO((train.departureDateTime as unknown as string)),
        arrivalDateTime: DateTime.fromISO((train.arrivalDateTime as unknown as string)),
      }))),
    }))
  }

  private handleError(error: FetchError | Error | unknown): Error {
    console.error('TripsRepository error:', error)

    if (error instanceof FetchError) {
      switch (error.statusCode) {
        case 404:
          return new Error('No trips found')
        case 401:
          return new Error('Unauthorized access')
        case 403:
          return new Error('Forbidden access')
        default:
          return new Error(`Failed to fetch trips: ${error.message}`)
      }
    }

    return new Error('An unexpected error occurred while fetching trips')
  }
}
