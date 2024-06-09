import { Request, Response } from 'express'
import httpErrors from 'http-errors'
import { inject, injectable } from 'inversify'
import { ExpressController } from '../../../../shared/adapters/in/express-web-server'
import { validate as isValidUuid } from 'uuid'

import {
  GET_MEASUREMENT_INPUT_PORT,
  GetMeasurementInputPort,
} from '../../../core/application/ports/in/get-measurement.input-port'
import { GetMeasurementQuery } from '../../../core/application/queries/measurement/get-measurement.query'
import { MeasurementNotFound } from '../../../core/domain/measurement/errors'

@injectable()
export class GetMeasurementController implements ExpressController {
  readonly route = '/api/measurement/:cabinetUid'
  readonly method = 'get'

  constructor(
    @inject(GET_MEASUREMENT_INPUT_PORT)
    private readonly queryHandler: GetMeasurementInputPort,
  ) {}
  async handler(req: Request, res: Response) {
    if (!isValidUuid(req.params.cabinetUid))
      throw new httpErrors.BadRequest('cabinetUid must be an uuid')

    try {
      const query = GetMeasurementQuery.from({
        cabinetUid: req.params.cabinetUid,
      })
      const resp = await this.queryHandler.execute(query)
      res.json(resp)
    } catch (error) {
      if (error instanceof MeasurementNotFound)
        throw new httpErrors[500](error.message)
      throw error
    }
  }
}
