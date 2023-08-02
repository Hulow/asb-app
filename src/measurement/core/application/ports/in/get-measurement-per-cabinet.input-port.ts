import { Measurement } from '../../../domain/measurement';

export const GET_MEASUREMENT_PER_CABINET_INPUT_PORT = Symbol.for('GetMeasurementsPerCabinetInputPort');

export interface GetMeasurementPerCabinetInputPort {
  handler: (cabinetUid: string) => Promise<Measurement>;
}
