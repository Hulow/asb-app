import { Measurement } from '../../../domain/measurement';

export const GET_MEASUREMENT_PER_CABINET_INPUT_PORT = Symbol.for('GetMeasurementsPerCabinetInputPort');

export interface GetMeasurementPerCabinetInput {
  cabinetUid: string;
}

export interface GetMeasurementPerCabinetInputPort {
  handler: (cabinetUid: GetMeasurementPerCabinetInput) => Promise<Measurement>;
}
