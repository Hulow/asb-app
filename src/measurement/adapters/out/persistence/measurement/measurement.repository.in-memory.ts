/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { MeasurementRepositoryOutputPort } from '../../../../core/application/ports/out/measurement-repository.output-port'
import { Measurement } from '../../../../core/domain/measurement/measurement'

@injectable()
export class InMemoryMeasurementRepository
  implements MeasurementRepositoryOutputPort
{
  public measurements: Measurement[] = []
  public storedMeasurements: Measurement[] = []

  clean(): void {
    this.measurements = []
  }

  add(measurements: Measurement): this {
    this.measurements.push(measurements)
    return this
  }

  toHaveBeenCalledWith(): Measurement[] {
    return this.storedMeasurements
  }

  async getMeasurementByCabinetUid(
    cabinetUid: string,
  ): Promise<Measurement | undefined> {
    if (this.measurements.length === 0) return Promise.resolve(undefined)
    return Promise.resolve(this.measurements[0])
  }
}
