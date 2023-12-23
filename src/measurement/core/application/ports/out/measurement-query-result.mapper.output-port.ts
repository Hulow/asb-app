import { Measurement } from '../../../domain/measurement';

export const MEASUREMENT_QUERY_RESULT_MAPPER_OUTPUT_PORT = Symbol.for('MeasurementQueryResultMapperOutputPort');

export interface MeasurementQueryResultMapperOutputPort {
  mapMeasurement: () => Measurement;
}
