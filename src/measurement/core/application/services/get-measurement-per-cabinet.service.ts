import { inject, injectable } from 'inversify';

import { GetMeasurementPerCabinetInputPort } from '../ports/in/get-measurement-per-cabinet.input-port';

import {
  MeasurementRepositoryOutputPort,
  MEASUREMENT_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/measurement-repository.output-port';
import { Measurement } from '../../domain/measurement';
import { MeasurementNotFound } from '../../domain/errors';

@injectable()
export class GetMeasurementPerCabinetService implements GetMeasurementPerCabinetInputPort {
  constructor(
    @inject(MEASUREMENT_REPOSITORY_OUTPUT_PORT) private readonly measurementRepository: MeasurementRepositoryOutputPort,
  ) {}

  async handler(cabinetUid: string): Promise<Measurement> {
    const measurement = await this.measurementRepository.getMeasurementByCabinetUid(cabinetUid);
    if (!measurement) throw new MeasurementNotFound(cabinetUid);
    return measurement;
  }
}
