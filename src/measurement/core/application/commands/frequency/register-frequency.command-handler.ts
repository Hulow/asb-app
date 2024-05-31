import { inject, injectable } from 'inversify'

import { RegisterFrequencyCommand } from './register-frequency.command'
import { RegisterFrequencyInputPort } from '../../ports/in/register-frequency.input-port'
import {
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
  FrequencyRepositoryOutputPort,
} from '../../ports/out/frequency-repository.output-port'
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../ports/out/cabinet-repository.output-port'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import { FrequencyAlreadyExists } from '../../../domain/frequency/errors'
import { RegisterFrequencyMapper } from './register-frequency.mapper'
import { Frequency } from '../../../domain/frequency/frequency'

@injectable()
export class RegisterFrequencyCommandHandler
  implements RegisterFrequencyInputPort
{
  constructor(
    @inject(FREQUENCY_REPOSITORY_OUTPUT_PORT)
    private readonly frequencyRepository: FrequencyRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT)
    private readonly cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async execute(command: RegisterFrequencyCommand): Promise<void> {
    const existingCabinet = await this.cabinetRepository.getById(
      command.cabinetUid,
    )
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(command.cabinetUid)
    }
    const existingFrequency = await this.frequencyRepository.getByCabinetUid(
      command.cabinetUid,
    )
    if (existingFrequency) {
      throw new FrequencyAlreadyExists(command.cabinetUid)
    }
    const newFrequency = new RegisterFrequencyMapper().mapFrequency(command)
    await this.frequencyRepository.save(new Frequency({ ...newFrequency }))
  }
}
