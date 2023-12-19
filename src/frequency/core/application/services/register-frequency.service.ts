import { inject, injectable } from 'inversify';

import { Frequency } from '../../domain/frequency';
import { RegisterFrequencyInput, RegisterFrequencyInputPort } from '../ports/in/register-frequency.input-port';
import {
  FrequencyRepositoryOutputPort,
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/frequency-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import { FrequencyAlreadyExists } from '../../domain/errors';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { FREQUENCY_MAPPER_OUTPUT_PORT, FrequencyMapperOutputPort } from '../ports/out/frequency.mapper.output-port';

@injectable()
export class RegisterFrequencyService implements RegisterFrequencyInputPort {
  constructor(
    @inject(FREQUENCY_REPOSITORY_OUTPUT_PORT) private readonly frequencyRepository: FrequencyRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
    @inject(FREQUENCY_MAPPER_OUTPUT_PORT) private readonly frequencyMapper: FrequencyMapperOutputPort,
  ) {}

  async handler(input: RegisterFrequencyInput): Promise<Frequency> {
    const existingCabinet = await this.cabinetRepository.getById(input.cabinetUid);
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(input.cabinetUid);
    }
    const existingFrequency = await this.frequencyRepository.getByCabinetUid(input.cabinetUid);
    if (existingFrequency) {
      throw new FrequencyAlreadyExists(input.cabinetUid);
    }
    const newFrequency = this.frequencyMapper.mapFrequency(input);
    return await this.frequencyRepository.save(new Frequency({ ...newFrequency }));
  }
}
