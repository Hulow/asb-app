import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  RegisterCabinetInputPort,
  REGISTER_CABINET_INPUT_PORT,
} from '../../../core/application/ports/in/register-cabinet.input-port'
import { RegisterCabinetCommand } from '../../../core/application/commands/register-cabinet.command'
import { OwnerDoesNotExist } from '../../../core/domain/owner/errors'
import { CabinetAlreadyExists } from '../../../core/domain/cabinet/errors'

@injectable()
export class RegisterCabinetController implements ExpressController {
  readonly route = '/api/cabinet/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_CABINET_INPUT_PORT)
    private readonly registerCabinetCommandHandler: RegisterCabinetInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const {
      brandName,
      productName,
      enclosureType,
      weight,
      dimension,
      manufacturingYear,
      description,
      ownerUid,
    } = req.body
    try {
      const command = RegisterCabinetCommand.from({
        brandName,
        productName,
        enclosureType,
        weight,
        dimension,
        manufacturingYear,
        description,
        ownerUid,
      })
      const response = await this.registerCabinetCommandHandler.execute(command)
      res.json(response)
    } catch (error) {
      if (error instanceof OwnerDoesNotExist)
        throw new httpErrors.NotFound(error.message)
      if (error instanceof CabinetAlreadyExists)
        throw new httpErrors.NotFound(error.message)
      throw error
    }
  }
}
