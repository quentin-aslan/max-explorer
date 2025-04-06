// server/api/import-trains.post.ts
import { defineEventHandler, createError } from 'h3'
import { importTrains } from '~/server/utils/import-trains'

export default defineEventHandler(async () => {
  try {
    const message = await importTrains()
    return { message }
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred during data import.',
    })
  }
})
