import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'
import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  REGISTER_OWNER_INPUT_PORT,
  RegisterOwnerInputPort,
} from '../../../core/application/ports/in/register-owner.input-port'
import { RegisterOwnerCommand } from '../../../core/application/commands/owner/register-owner.command'
import { OwnerAlreadyExists } from '../../../core/domain/owner/errors'

@injectable()
export class RegisterOwnerController implements ExpressController {
  readonly route = '/api/owner/register'
  readonly method = 'post'

  constructor(
    @inject(REGISTER_OWNER_INPUT_PORT)
    private readonly registerOwnerCommandHandler: RegisterOwnerInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const {
      firstName,
      lastName,
      ownername,
      email,
      phoneNumber,
      city,
      description,
    } = req.body
    try {
      const command = RegisterOwnerCommand.from({
        firstName,
        lastName,
        ownername,
        email,
        phoneNumber,
        city,
        description,
      })
      const response = await this.registerOwnerCommandHandler.execute(command)
      res.json(response)
    } catch (error) {
      if (error instanceof OwnerAlreadyExists)
        throw new httpErrors.NotFound(error.message)
      throw error
    }
  }
}
