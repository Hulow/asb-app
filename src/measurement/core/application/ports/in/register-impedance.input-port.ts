import { Impedance } from '../../../domain/impedance/impedance'
import { RegisterImpedanceCommand } from '../../commands/impedance/register-impedance.command'

export const REGISTER_IMPEDANCE_INPUT_PORT = Symbol.for(
  'RegisterImpedanceInputPort',
)

export abstract class RegisterImpedanceInputPort {
  public abstract execute(command: RegisterImpedanceCommand): Promise<Impedance>
}
