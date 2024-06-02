import { Measurement } from '../../../domain/measurement/measurement'

export const MEASUREMENT_REPOSITORY_OUTPUT_PORT = Symbol.for(
  'MeasurementRepositoryOutputPort',
)

export abstract class MeasurementRepositoryOutputPort {
  public abstract getMeasurementByCabinetUid(
    cabinetUid: string,
  ): Promise<Measurement | undefined>
}
