// COMMON FUNCTION
export const normalizeName = (name: string) => {
  return name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/ç/g, 'c')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/-/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}
