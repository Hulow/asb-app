import { inject, injectable } from 'inversify'

import { GetMeasurementQuery } from './get-measurement.query'
import { GetMeasurementInputPort } from '../../ports/in/get-measurement.input-port'
import {
  MEASUREMENT_REPOSITORY_OUTPUT_PORT,
  MeasurementRepositoryOutputPort,
} from '../../ports/out/measurement-repository.output-port'
import { Measurement } from '../../../domain/measurement/measurement'
import { MeasurementNotFound } from '../../../domain/measurement/errors'

@injectable()
export class GetMeasurementQueryHandler implements GetMeasurementInputPort {
  constructor(
    @inject(MEASUREMENT_REPOSITORY_OUTPUT_PORT)
    private readonly measurementRepository: MeasurementRepositoryOutputPort,
  ) {}

  async execute(query: GetMeasurementQuery): Promise<Measurement> {
    const measurement =
      await this.measurementRepository.getMeasurementByCabinetUid(
        query.cabinetUid,
      )
    if (!measurement) throw new MeasurementNotFound(query.cabinetUid)
    return measurement
  }
}
