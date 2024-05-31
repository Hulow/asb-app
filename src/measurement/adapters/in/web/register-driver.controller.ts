import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterDriverInputPort,
  REGISTER_DRIVER_INPUT_PORT,
  RegisterDriverInput,
} from '../../../core/application/ports/in/register-driver.input-port'
import { RegisterDriverCommand } from '../../../core/application/commands/register-driver.command'
import { DriversAlreadyExists } from '../../../core/domain/driver/errors'
import { CabinetDoesNotExist } from '../../../core/domain/cabinet/errors'
import { OwnerDoesNotExist } from '../../../core/domain/owner/errors'

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
      manufacturingYear,
      nominalDiameter,
      nominalImpedance,
      continuousPowerHandling,
      ownerUid,
      cabinetUid,
    } = req.body as RegisterDriverInput
    try {
      const command = RegisterDriverCommand.from({
        brandName,
        productName,
        driverType,
        manufacturingYear,
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
        throw new httpErrors.NotFound(error.message)
      if (error instanceof CabinetDoesNotExist)
        throw new httpErrors.NotFound(error.message)
      if (error instanceof OwnerDoesNotExist)
        throw new httpErrors.NotFound(error.message)
      throw error
    }
  }
}
