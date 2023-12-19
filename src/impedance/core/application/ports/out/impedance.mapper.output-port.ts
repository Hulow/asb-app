import { ImpedanceProps } from '../../../domain/impedance';
import { RegisterImpedanceInput } from '../in/register-impedance.input-port';

export interface ImpedanceMapperOutputPort {
  mapImpedance: (input: RegisterImpedanceInput) => ImpedanceProps;
}

export const IMPEDANCE_MAPPER_OUTPUT_PORT = Symbol.for('ImpedanceMapperOutputPort');
