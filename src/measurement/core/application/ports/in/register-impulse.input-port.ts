import { Impulse } from "../../../domain/impulse/impulse";
import { RegisterImpulseCommand } from "../../commands/impulse/register-impulse.command";

export const REGISTER_IMPULSE_INPUT_PORT = Symbol.for('RegisterImpulseInputPort');

export abstract class RegisterImpulseInputPort {
  public abstract execute(command: RegisterImpulseCommand): Promise<Impulse>;
}
