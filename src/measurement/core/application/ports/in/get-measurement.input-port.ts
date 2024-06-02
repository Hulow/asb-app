import { Measurement } from '../../../domain/measurement/measurement'
import { GetMeasurementQuery } from '../../queries/measurement/get-measurement.query'

export const GET_MEASUREMENT_INPUT_PORT = Symbol.for('GetMeasurementInputPort')

export abstract class GetMeasurementInputPort {
  public abstract execute(query: GetMeasurementQuery): Promise<Measurement>
}
