import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'

import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import {
  GET_CABINETS_INPUT_PORT,
  GetCabinetsInputPort,
} from '../../../core/application/ports/in/get-cabinets.input-port'
import { CabinetsNotFound } from '../../../core/domain/cabinet/errors'

@injectable()
export class GetCabinetsController implements ExpressController {
  readonly route = '/api/cabinets'
  readonly method = 'get'

  constructor(
    @inject(GET_CABINETS_INPUT_PORT)
    private readonly queryHandler: GetCabinetsInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    try {
      const response = await this.queryHandler.execute()
      res.json(response)
    } catch (error) {
      if (error instanceof CabinetsNotFound)
        throw new httpErrors[500](error.message)
      throw error
    }
  }
}
