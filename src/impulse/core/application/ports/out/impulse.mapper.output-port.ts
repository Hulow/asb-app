import { ImpulseProps } from '../../../domain/impulse';
import { RegisterImpulseInput } from '../in/register-impulse.input-port';

export interface ImpulseMapperOutputPort {
  mapImpulse: (input: RegisterImpulseInput) => ImpulseProps;
}

export const IMPULSE_MAPPER_OUTPUT_PORT = Symbol.for('ImpulseMapperOutputPort');
