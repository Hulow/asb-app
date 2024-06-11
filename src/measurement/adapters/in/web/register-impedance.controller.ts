import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterImpedanceInputPort,
  REGISTER_IMPEDANCE_INPUT_PORT,
} from '../../../core/application/ports/in/register-impedance.input-port'
import { RegisterImpedanceCommand } from '../../../core/application/commands/impedance/register-impedance.command'
import { UnableToExtractImpedanceData } from '../../../core/domain/impedance/errors'
import { CabinetDoesNotExist } from '../../../core/domain/cabinet/errors'

@injectable()
export class RegisterImpedanceController implements ExpressController {
  readonly route = '/api/impedance/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_IMPEDANCE_INPUT_PORT)
    private readonly commandHandler: RegisterImpedanceInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const { ownerUid, cabinetUid, driverUid, measurements } = req.body
    try {
      const command = RegisterImpedanceCommand.from({
        ownerUid,
        cabinetUid,
        driverUid,
        measurements,
      })
      const response = await this.commandHandler.execute(command)
      res.json(response)
    } catch (error) {
      if (error instanceof CabinetDoesNotExist)
        throw new httpErrors[500](error.message)
      if (error instanceof UnableToExtractImpedanceData)
        throw new httpErrors[500](error.message)
      throw error
    }
  }
}
