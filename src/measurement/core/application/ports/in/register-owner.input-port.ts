import { Owner } from '../../../domain/owner';
import { RegisterOwnerCommand } from '../../commands/register-owner.command';

export const REGISTER_OWNER_INPUT_PORT = Symbol.for('RegisterOwnerInputPort');

export interface RegisterOwnerInput {
  firstName: string;
  lastName: string;
  ownername: string;
  email: string;
  phoneNumber: string;
  city: string;
  description: string;
}


export abstract class RegisterOwnerInputPort {
  public abstract execute(command: RegisterOwnerCommand): Promise<Owner>
}
