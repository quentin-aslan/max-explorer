import { defineCronHandler } from '#nuxt/cron'
import { importTrains } from '~/server/utils/import-trains'
import { importDestinations } from '~/server/utils/import-destinations'

export default defineCronHandler(() => '0 7 * * *', async () => {
  try {
    console.log('Running CRON import...')
    const importDestinationMsg = await importDestinations()
    console.log(importDestinationMsg)

    const importTrainsMsg = await importTrains()
    console.log(importTrainsMsg)
  }
  catch (e) {
    console.error(e)
  }
  finally {
    console.log('CRON finished.')
  }
}, { runOnInit: true })
