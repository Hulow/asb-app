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
import { FrequencyMapper } from '../../../adapters/out/frequency.mapper';

@injectable()
export class RegisterFrequencyService implements RegisterFrequencyInputPort {
  constructor(
    @inject(FREQUENCY_REPOSITORY_OUTPUT_PORT) private readonly frequencyRepository: FrequencyRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async handler(input: RegisterFrequencyInput): Promise<Frequency> {
    new FrequencyMapper(input).mapFrequency();
    const existingCabinet = await this.cabinetRepository.getById(input.cabinetUid);
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(input.cabinetUid);
    }
    const existingFrequency = await this.frequencyRepository.getByCabinetUid(input.cabinetUid);
    if (existingFrequency) {
      throw new FrequencyAlreadyExists(input.cabinetUid);
    }
    const newFrequency = new FrequencyMapper(input).mapFrequency();
    return await this.frequencyRepository.save(new Frequency({ ...newFrequency }));
  }
}
