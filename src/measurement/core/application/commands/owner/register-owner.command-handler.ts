import { inject, injectable } from 'inversify'
import { RegisterOwnerInputPort } from '../../ports/in/register-owner.input-port'
import {
  OWNER_REPOSITORY_OUTPUT_PORT,
  OwnerRepositoryOutputPort,
} from '../../ports/out/owner-repository.output-port'
import { RegisterOwnerCommand } from './register-owner.command'
import { Owner } from '../../../domain/owner/owner'
import { OwnerAlreadyExists } from '../../../domain/owner/errors'

@injectable()
export class RegisterOwnerCommandHandler implements RegisterOwnerInputPort {
  constructor(
    @inject(OWNER_REPOSITORY_OUTPUT_PORT)
    private readonly _ownerRepository: OwnerRepositoryOutputPort,
  ) {}

  async execute(command: RegisterOwnerCommand): Promise<Owner> {
    const owner = new Owner({ ...command })

    const existingOwner = await this._ownerRepository.getByOwnername(
      command.ownername,
    )
    if (existingOwner) {
      throw new OwnerAlreadyExists(existingOwner.ownername)
    }
    return await this._ownerRepository.save(owner)
  }
}
