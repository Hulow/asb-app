import { CabinetQueryResult } from '../../queries/cabinet/get-cabinets.query-result'

export const GET_CABINETS_INPUT_PORT = Symbol.for('GetCabinetsInputPort')

export abstract class GetCabinetsInputPort {
  public abstract execute(): Promise<CabinetQueryResult[]>
}
