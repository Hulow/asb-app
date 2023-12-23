import { Measurement } from '../../../domain/measurement';

export const MEASUREMENT_REPOSITORY_OUTPUT_PORT = Symbol.for('MeasurementRepositoryOutputPort');

export interface MeasurementRepositoryOutputPort {
  getMeasurementByCabinetUid: (cabinetUid: string) => Promise<Measurement | undefined>;
}
