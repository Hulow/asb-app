import { inject, injectable } from 'inversify';

import { RegisterImpulseMapper } from './register-impulse.mapper';
import { RegisterImpulseCommand } from './register-impulse.command';
import { RegisterImpulseInputPort } from '../../ports/in/register-impulse.input-port';
import { IMPULSE_REPOSITORY_OUTPUT_PORT, ImpulseRepositoryOutputPort } from '../../ports/out/impulse-repository.output-port';
import { CABINET_REPOSITORY_OUTPUT_PORT, CabinetRepositoryOutputPort } from '../../ports/out/cabinet-repository.output-port';
import { Impulse, ImpulseProps } from '../../../domain/impulse/impulse';
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors';
import { ImpulseAlreadyExists, MissingImpulseGraphDataFound } from '../../../domain/impulse/errors';

@injectable()
export class RegisterImpulseCommandHandler implements RegisterImpulseInputPort {
  constructor(
    @inject(IMPULSE_REPOSITORY_OUTPUT_PORT) private readonly impulseRepository: ImpulseRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async execute(command: RegisterImpulseCommand): Promise<Impulse> {
    const existingCabinet = await this.cabinetRepository.getById(command.cabinetUid);
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(command.cabinetUid);
    }

    const existingImpulse = await this.impulseRepository.getByCabinetUid(command.cabinetUid);
    if (existingImpulse) {
      throw new ImpulseAlreadyExists(command.cabinetUid);
    }

    const newImpulse: ImpulseProps = new RegisterImpulseMapper().mapImpulse(command);
    this.verifyResponseLength(newImpulse);
    return await this.impulseRepository.save(new Impulse(newImpulse));
  }

  private verifyResponseLength(newImpulse: ImpulseProps) {
    if (newImpulse.measurements.length !== Number(newImpulse.responseLength)) {
      throw new MissingImpulseGraphDataFound(newImpulse.responseLength, newImpulse.measurements.length);
    }
  }
}
