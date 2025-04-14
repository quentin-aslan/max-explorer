// libs/dateUtils.ts

import type { DurationLikeObject } from 'luxon'
import { DateTime } from 'luxon'

const DEFAULT_ZONE = 'Europe/Paris'

export const parseISODate = (iso: string): DateTime => {
  return DateTime.fromISO(iso, { zone: DEFAULT_ZONE })
}

export const fromJSDate = (date: Date): DateTime => {
  return DateTime.fromJSDate(date, { zone: DEFAULT_ZONE })
}

export const toUTCJSDate = (dt: DateTime): Date => {
  return dt.toUTC().toJSDate()
}

export const addDuration = (dt: DateTime, duration: DurationLikeObject): DateTime => {
  return dt.plus(duration)
}

export const isBefore = (dt1: DateTime, dt2: DateTime): boolean => {
  return dt1.toUTC() < dt2.toUTC()
}

/**
 * Get the ms since epoch equivalent of a new Date().getTime()
 * @param dt
 */
export const toMillis = (dt: DateTime): number => {
  return dt.toMillis() // https://moment.github.io/luxon/index.html#/moment?id=basics
}
