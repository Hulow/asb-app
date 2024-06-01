import { Impulse } from "../../../domain/impulse/impulse";

export abstract class ImpulseRepositoryOutputPort {
  public abstract save(impulse: Impulse): Promise<Impulse>;
  public abstract getByCabinetUid(cabinetUid: string): Promise<Impulse | undefined>;
}

export const IMPULSE_REPOSITORY_OUTPUT_PORT = Symbol.for('ImpulseRepositoryOutputPort');
