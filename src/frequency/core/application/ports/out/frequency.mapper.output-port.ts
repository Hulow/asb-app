import { FrequencyProps } from '../../../domain/frequency';
import { RegisterFrequencyInput } from '../in/register-frequency.input-port';

export interface FrequencyMapperOutputPort {
  mapFrequency: (input: RegisterFrequencyInput) => FrequencyProps;
}

export const FREQUENCY_MAPPER_OUTPUT_PORT = Symbol.for('FrequencyMapperOutputPort');
