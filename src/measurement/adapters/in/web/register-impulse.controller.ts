import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterImpulseInputPort,
  REGISTER_IMPULSE_INPUT_PORT,
} from '../../../core/application/ports/in/register-impulse.input-port'
import { RegisterImpulseCommand } from '../../../core/application/commands/impulse/register-impulse.command'
import {
  ImpulseAlreadyExists,
  ImpulseSettingNotFound,
  MissingImpulseGraphDataFound,
} from '../../../core/domain/impulse/errors'
import { CabinetDoesNotExist } from '../../../core/domain/cabinet/errors'

@injectable()
export class RegisterImpulseController implements ExpressController {
  readonly route = '/api/impulse/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_IMPULSE_INPUT_PORT)
    private readonly commandHandler: RegisterImpulseInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const { ownerUid, cabinetUid, driverUid, measurements } = req.body
    try {
      const command = RegisterImpulseCommand.from({
        ownerUid,
        cabinetUid,
        driverUid,
        measurements,
      })
      const response = await this.commandHandler.execute(command)
      res.json(response)
    } catch (error) {
      if (error instanceof ImpulseAlreadyExists)
        throw new httpErrors.NotFound(error.message)
      if (error instanceof ImpulseSettingNotFound)
        throw new httpErrors.NotFound(error.message)
      if (error instanceof CabinetDoesNotExist)
        throw new httpErrors.NotFound(error.message)
      if (error instanceof MissingImpulseGraphDataFound)
        throw new httpErrors.NotFound(error.message)
    }
  }
}
