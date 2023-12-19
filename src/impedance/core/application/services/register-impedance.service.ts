import { inject, injectable } from 'inversify';

import { Impedance } from '../../domain/impedance';
import { RegisterImpedanceInput, RegisterImpedanceInputPort } from '../ports/in/register-impedance.input-port';
import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/impedance-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { ImpedanceAlreadyExists } from '../../../../impedance/core/domain/errors';
import { IMPEDANCE_MAPPER_OUTPUT_PORT } from '../ports/out/impedance.mapper.output-port';
import { ImpedanceMapper } from '../../../adapters/out/impedance.mapper';

@injectable()
export class RegisterImpedanceService implements RegisterImpedanceInputPort {
  constructor(
    @inject(IMPEDANCE_REPOSITORY_OUTPUT_PORT) private readonly impedanceRepository: ImpedanceRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly cabinetRepository: CabinetRepositoryOutputPort,
    @inject(IMPEDANCE_MAPPER_OUTPUT_PORT) private readonly impedanceMapper: ImpedanceMapper,
  ) {}

  async handler(input: RegisterImpedanceInput): Promise<Impedance> {
    const existingCabinet = await this.cabinetRepository.getById(input.cabinetUid);
    if (!existingCabinet) throw new CabinetDoesNotExist(input.cabinetUid);
    const existingImpedance = await this.impedanceRepository.getByCabinetUid(input.cabinetUid);
    if (existingImpedance) throw new ImpedanceAlreadyExists(input.cabinetUid);
    const newImpedance = this.impedanceMapper.mapImpedance(input);
    return await this.impedanceRepository.save(new Impedance(newImpedance));
  }
}
