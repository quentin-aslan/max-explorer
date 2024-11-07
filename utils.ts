export const toISOStringWithOffset = (date: Date): string => {
  const timezoneOffset = date.getTimezoneOffset() * 60000 // offset in milliseconds
  const adjustedDate = new Date(date.getTime() - timezoneOffset)
  return adjustedDate.toISOString()
}
