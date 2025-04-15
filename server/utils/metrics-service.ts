import { Histogram, collectDefaultMetrics, Registry } from 'prom-client'

class MetricsService {
  private httpHistogram: Histogram<string>
  private registry: Registry

  constructor() {
    const ADD_DEFAULT_METRICS_TO_REGISTERY = false
    this.registry = new Registry()

    collectDefaultMetrics((ADD_DEFAULT_METRICS_TO_REGISTERY) ? { register: this.registry } : {}) // Collecte les métriques Node.js de base une seule fois

    this.httpHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Durée des requêtes HTTP en secondes',
      labelNames: [
        'method',
        'route',
        'status_code',
        'origin',
        'destination',
        'departureDate',
        'returnDate',
        'directOnly',
      ],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    })
  }

  private safeLabel(value: string | number | boolean | undefined | null, fallback = 'unknown'): string {
    if (value === null || value === undefined || value === '') return fallback
    return String(value)
  }

  startTimerFindTrips(rawLabels: {
    method?: string
    route?: string
    origin?: string
    destination?: string
    departureDate?: string
    returnDate?: string
    directOnly?: boolean
  }) {
    const end = this.httpHistogram.startTimer()

    return (status_code: number) =>
      end({
        method: this.safeLabel(rawLabels.method),
        route: this.safeLabel(rawLabels.route),
        status_code: this.safeLabel(status_code),
        origin: this.safeLabel(rawLabels.origin),
        destination: this.safeLabel(rawLabels.destination, 'none'),
        departureDate: this.safeLabel(rawLabels.departureDate, 'unspecified'),
        returnDate: this.safeLabel(rawLabels.returnDate, 'unspecified'),
        directOnly: this.safeLabel(rawLabels.directOnly, 'false'),
      })
  }

  async getMetrics() {
    return this.registry.metrics()
  }
}

// Singleton
const metricsService = new MetricsService()
export default metricsService
