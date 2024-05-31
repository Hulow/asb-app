import { Cabinet } from '../../../domain/cabinet/cabinet'
import { RegisterCabinetCommand } from '../../commands/register-cabinet.command'

export const REGISTER_CABINET_INPUT_PORT = Symbol.for(
  'RegisterCabinetInputPort',
)

export abstract class RegisterCabinetInputPort {
  public abstract execute(command: RegisterCabinetCommand): Promise<Cabinet>
}
