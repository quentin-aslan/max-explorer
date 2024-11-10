export const toISOStringWithOffset = (date: Date): string => {
  if (!date) return
  const timezoneOffset = date.getTimezoneOffset() * 60000 // offset in milliseconds
  const adjustedDate = new Date(date.getTime() - timezoneOffset)
  return adjustedDate.toISOString()
}

export const formattedDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formattedDateWithoutTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formattedTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const msToTime = (duration: number): string => {
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  if (hours === 0) {
    return `${minutes}m`
  }

  return `${hours}h ${minutes}m`
}
