export const GET_CABINET_COUNT_INPUT_PORT = Symbol.for('GetCabinetCountInputPort');

export interface GetCabinetCountInputPort {
  handler: () => Promise<number>;
}
