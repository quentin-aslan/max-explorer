import { defineCronHandler } from '#nuxt/cron'
import { importTrains } from '~/server/utils/import-trains'

export default defineCronHandler(() => '0 7 * * *', async () => {
  try {
    console.log('Running CRON import...')
    const message = await importTrains()
    console.log(message)
  }
  catch (e) {
    console.error(e)
  }
  finally {
    console.log('CRON finished.')
  }
}, { runOnInit: true })
