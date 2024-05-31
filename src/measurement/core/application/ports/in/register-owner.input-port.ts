import { Owner } from '../../../domain/owner/owner'
import { RegisterOwnerCommand } from '../../commands/register-owner.command'

export const REGISTER_OWNER_INPUT_PORT = Symbol.for('RegisterOwnerInputPort')

export abstract class RegisterOwnerInputPort {
  public abstract execute(command: RegisterOwnerCommand): Promise<Owner>
}
