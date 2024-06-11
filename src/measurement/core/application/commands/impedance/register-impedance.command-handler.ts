import { inject, injectable } from 'inversify'

import { RegisterImpedanceMapper } from './register-impedance.mapper'
import { RegisterImpedanceCommand } from './register-impedance.command'
import { RegisterImpedanceInputPort } from '../../ports/in/register-impedance.input-port'
import {
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
  ImpedanceRepositoryOutputPort,
} from '../../ports/out/impedance-repository.output-port'
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../ports/out/cabinet-repository.output-port'
import { Impedance } from '../../../domain/impedance/impedance'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'

@injectable()
export class RegisterImpedanceCommandHandler
  implements RegisterImpedanceInputPort
{
  constructor(
    @inject(IMPEDANCE_REPOSITORY_OUTPUT_PORT)
    private readonly impedanceRepository: ImpedanceRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT)
    private readonly cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async execute(command: RegisterImpedanceCommand): Promise<Impedance> {
    const existingCabinet = await this.cabinetRepository.getById(
      command.cabinetUid,
    )

    if (!existingCabinet) throw new CabinetDoesNotExist(command.cabinetUid)
    const newImpedance = new RegisterImpedanceMapper().mapImpedance(command)

    return await this.impedanceRepository.save(new Impedance(newImpedance))
  }
}
