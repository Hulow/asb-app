import { Frequency } from '../../../domain/frequency/frequency'

export abstract class FrequencyRepositoryOutputPort {
  public abstract save(frequency: Frequency): Promise<void>
  public abstract getByCabinetUid(
    cabinetUid: string,
  ): Promise<Frequency | undefined>
}

export const FREQUENCY_REPOSITORY_OUTPUT_PORT = Symbol.for(
  'FrequencyRepositoryOutputPort',
)
