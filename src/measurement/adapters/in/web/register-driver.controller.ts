import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterDriverInputPort,
  REGISTER_DRIVER_INPUT_PORT,
} from '../../../core/application/ports/in/register-driver.input-port'
import { DriversAlreadyExists } from '../../../core/domain/driver/errors'
import { CabinetDoesNotExist } from '../../../core/domain/cabinet/errors'
import { OwnerDoesNotExist } from '../../../core/domain/owner/errors'
import { RegisterDriverCommand } from '../../../core/application/commands/driver/register-driver.command'

@injectable()
export class RegisterDriverController implements ExpressController {
  readonly route = '/api/driver/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_DRIVER_INPUT_PORT)
    private readonly commandHandler: RegisterDriverInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const {
      brandName,
      productName,
      driverType,
      nominalDiameter,
      nominalImpedance,
      continuousPowerHandling,
      ownerUid,
      cabinetUid,
    } = req.body
    try {
      const command = RegisterDriverCommand.from({
        brandName,
        productName,
        driverType,
        nominalDiameter,
        nominalImpedance,
        continuousPowerHandling,
        ownerUid,
        cabinetUid,
      })
      const response = await this.commandHandler.execute(command)
      res.json(response)
    } catch (error) {
      if (error instanceof DriversAlreadyExists)
        throw new httpErrors[500](error.message)
      if (error instanceof CabinetDoesNotExist)
        throw new httpErrors[500](error.message)
      if (error instanceof OwnerDoesNotExist)
        throw new httpErrors[500](error.message)
      throw error
    }
  }
}
