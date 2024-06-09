import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterFrequencyInputPort,
  REGISTER_FREQUENCY_INPUT_PORT,
} from '../../../core/application/ports/in/register-frequency.input-port'
import { RegisterFrequencyCommand } from '../../../core/application/commands/frequency/register-frequency.command'
import {
  FrequencyAlreadyExists,
  FrequencyParameterNotFound,
} from '../../../core/domain/frequency/errors'
import { CabinetDoesNotExist } from '../../../core/domain/cabinet/errors'

@injectable()
export class RegisterFrequencyController implements ExpressController {
  readonly route = '/api/frequency/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_FREQUENCY_INPUT_PORT)
    private readonly _RegisterFrequencyCommandHandler: RegisterFrequencyInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const { ownerUid, cabinetUid, driverUid, measurements } = req.body
    try {
      const command = RegisterFrequencyCommand.from({
        ownerUid,
        cabinetUid,
        driverUid,
        measurements,
      })
      await this._RegisterFrequencyCommandHandler.execute(command)
      res.json({ resp: 'OK' })
    } catch (error) {
      if (error instanceof FrequencyAlreadyExists)
        throw new httpErrors[500](error.message)
      if (error instanceof FrequencyParameterNotFound)
        throw new httpErrors[500](error.message)
      if (error instanceof CabinetDoesNotExist)
        throw new httpErrors[500](error.message)
      throw error
    }
  }
}
