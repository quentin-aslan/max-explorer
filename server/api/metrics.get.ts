import metricsService from '~/server/utils/metrics-service'

export default defineEventHandler(async (event) => {
  // Set le bon content-type pour Prometheus
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return await metricsService.getMetrics()
})
