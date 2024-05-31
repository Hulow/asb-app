import { Impedance } from "../../../domain/impedance/impedance";

export const REGISTER_IMPEDANCE_INPUT_PORT = Symbol.for('RegisterImpedanceInputPort');

export interface RegisterImpedanceInput {
  ownerUid: string;
  cabinetUid: string;
  driverUid: string;
  measurements: string;
}

export abstract class RegisterImpedanceInputPort {
  public abstract execute(input: RegisterImpedanceInput): Promise<Impedance>;
}
