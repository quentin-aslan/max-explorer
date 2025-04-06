import { defineEventHandler, createError } from 'h3'
import { importDestinations } from '~/server/utils/import-destinations'

export default defineEventHandler(async () => {
  try {
    const message = await importDestinations()
    return { message }
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during data import.',
    })
  }
})
