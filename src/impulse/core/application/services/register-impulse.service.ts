import { inject, injectable } from 'inversify';

import { Impulse, ImpulseProps } from '../../domain/impulse';
import { RegisterImpulseInput, RegisterImpulseInputPort } from '../ports/in/register-impulse.input-port';
import {
  ImpulseRepositoryOutputPort,
  IMPULSE_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/impulse-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import { MissingImpulseGraphDataFound, ImpulseAlreadyExists } from '../../domain/errors';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { IMPULSE_MAPPER_OUTPUT_PORT, ImpulseMapperOutputPort } from '../ports/out/impulse.mapper.output-port';

@injectable()
export class RegisterImpulseService implements RegisterImpulseInputPort {
  constructor(
    @inject(IMPULSE_REPOSITORY_OUTPUT_PORT) private readonly impulseRepository: ImpulseRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
    @inject(IMPULSE_MAPPER_OUTPUT_PORT) private readonly impulseMapper: ImpulseMapperOutputPort,
  ) {}

  async handler(input: RegisterImpulseInput): Promise<Impulse> {
    const existingCabinet = await this.cabinetRepository.getById(input.cabinetUid);
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(input.cabinetUid);
    }

    const existingImpulse = await this.impulseRepository.getByCabinetUid(input.cabinetUid);
    if (existingImpulse) {
      throw new ImpulseAlreadyExists(input.cabinetUid);
    }

    const newImpulse: ImpulseProps = this.impulseMapper.mapImpulse(input);
    this.verifyResponseLength(newImpulse);
    return await this.impulseRepository.save(new Impulse(newImpulse));
  }

  private verifyResponseLength(newImpulse: ImpulseProps) {
    if (newImpulse.measurements.length !== Number(newImpulse.responseLength)) {
      throw new MissingImpulseGraphDataFound(newImpulse.responseLength, newImpulse.measurements.length);
    }
  }
}
