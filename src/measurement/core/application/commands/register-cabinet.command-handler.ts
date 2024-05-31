import { inject, injectable } from 'inversify'

import { RegisterCabinetInputPort } from '../ports/in/register-cabinet.input-port'
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/cabinet-repository.output-port'

import { RegisterCabinetCommand } from './register-cabinet.command'
import {
  OWNER_REPOSITORY_OUTPUT_PORT,
  OwnerRepositoryOutputPort,
} from '../ports/out/owner-repository.output-port'
import { Cabinet } from '../../domain/cabinet/cabinet'
import { OwnerDoesNotExist } from '../../domain/owner/errors'
import { CabinetAlreadyExists } from '../../domain/cabinet/errors'

@injectable()
export class RegisterCabinetCommandHandler implements RegisterCabinetInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT)
    private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT)
    private readonly _ownerRepository: OwnerRepositoryOutputPort,
  ) {}

  async execute(command: RegisterCabinetCommand): Promise<Cabinet> {
    const cabinet = new Cabinet({ ...command })
    const existingOwner = await this._ownerRepository.getById(command.ownerUid)

    if (!existingOwner) {
      throw new OwnerDoesNotExist(command.ownerUid)
    }
    const existingCabinet =
      await this._cabinetRepository.getByProductNameAndOwnerUid(
        command.productName,
        command.ownerUid,
      )

    if (existingCabinet) {
      throw new CabinetAlreadyExists(
        existingCabinet.productName,
        command.ownerUid,
      )
    }

    return await this._cabinetRepository.save(cabinet)
  }
}
