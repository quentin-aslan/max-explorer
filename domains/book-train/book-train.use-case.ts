import type { TrainViewModel } from '~/domains/trips/entities/view-models/train.view-model'

export class BookTrainUseCase {
  constructor(private readonly train: TrainViewModel) {}

  public execute() {
    const prompt = `${this.train.origin}+${this.train.destination}+${this.train.departureDateTime.day}/${this.train.departureDateTime.month}+a+${this.train.departureDateTime.hour}h`
    const SNCF_URL = 'https://www.sncf-connect.com/app/home/search?userInput='
    return SNCF_URL + prompt + '&utm_source=max-explorer.quentinaslan.fr'
  }
}
