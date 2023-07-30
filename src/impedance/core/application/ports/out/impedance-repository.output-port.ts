import { Impedance } from '../../../domain/impedance';

export interface ImpedanceRepositoryOutputPort {
  save: (impedance: Impedance) => Promise<Impedance>;
  getByCabinetUid: (cabinetUid: string) => Promise<Impedance | undefined>;
}

export const IMPEDANCE_REPOSITORY_OUTPUT_PORT = Symbol.for('ImpedanceRepositoryOutputPort');
