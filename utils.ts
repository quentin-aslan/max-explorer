// ! TODO: USE LUXON !!!

export const toISOStringWithOffset = (date: Date): string => {
  if (!date) return ''
  const timezoneOffset = date.getTimezoneOffset() * 60000 // offset in milliseconds
  const adjustedDate = new Date(date.getTime() - timezoneOffset)
  return adjustedDate.toISOString()
}

export const prettifyMinToH = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} minutes`
  }
  else if (remainingMinutes === 0) {
    return `${hours}h`
  }
  else {
    return `${hours}h${remainingMinutes}`
  }
}
