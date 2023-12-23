export interface MeasurementQueryMapperOutputPort {
  generateSelectQuery: () => string;
  generateDriverQuery: () => string;
  generateGroupByQuery: () => string;
}

export const MEASUREMENT_QUERY_MAPPER_OUTPUT_PORT = Symbol.for('MeasurementQueryMapperOutputPort');
