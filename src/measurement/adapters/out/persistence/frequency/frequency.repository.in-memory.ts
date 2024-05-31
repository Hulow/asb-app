/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { FrequencyRepositoryOutputPort } from '../../../../core/application/ports/out/frequency-repository.output-port'
import { Frequency } from '../../../../core/domain/frequency/frequency'

@injectable()
export class InMemoryFrequencyRepository
  implements FrequencyRepositoryOutputPort
{
  public frequencies: Frequency[] = []
  public storedFrequencies: Frequency[] = []

  clean(): void {
    this.frequencies = []
  }

  add(frequency: Frequency): this {
    this.frequencies.push(frequency)
    return this
  }

  toHaveBeenCalledWith(): Frequency[] {
    return this.storedFrequencies
  }

  save(frequency: Frequency) {
    this.storedFrequencies.push(frequency)
    return Promise.resolve(undefined)
  }

  async getByCabinetUid(cabinetUid: string) {
    return Promise.resolve(this.frequencies[0])
  }
}
