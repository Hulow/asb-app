import { Impedance } from "../../../domain/impedance/impedance";

export abstract class ImpedanceRepositoryOutputPort {
  public abstract save(impedance: Impedance): Promise<Impedance>;
  public abstract getByCabinetUid(cabinetUid: string): Promise<Impedance | undefined>;
}

export const IMPEDANCE_REPOSITORY_OUTPUT_PORT = Symbol.for('ImpedanceRepositoryOutputPort');
