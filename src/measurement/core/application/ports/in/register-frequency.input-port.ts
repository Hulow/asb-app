import { RegisterFrequencyCommand } from '../../commands/frequency/register-frequency.command'

export const REGISTER_FREQUENCY_INPUT_PORT = Symbol.for(
  'RegisterFrequencyInputPort',
)

export interface RegisterFrequencyInput {
  ownerUid: string
  cabinetUid: string
  driverUid: string
  measurements: string
}

export abstract class RegisterFrequencyInputPort {
  public abstract execute(command: RegisterFrequencyCommand): Promise<void>
}
