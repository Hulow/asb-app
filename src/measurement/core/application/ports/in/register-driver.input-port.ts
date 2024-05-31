import { Driver } from '../../../domain/driver/driver'
import { RegisterDriverCommand } from '../../commands/driver/register-driver.command'

export const REGISTER_DRIVER_INPUT_PORT = Symbol.for('RegisterDriverInputPort')

export abstract class RegisterDriverInputPort {
  public abstract execute(command: RegisterDriverCommand): Promise<Driver>
}
