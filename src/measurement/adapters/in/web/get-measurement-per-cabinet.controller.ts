import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';
import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import { validate as isValidUuid } from 'uuid';

import {
  GET_MEASUREMENT_PER_CABINET_INPUT_PORT,
  GetMeasurementPerCabinetInputPort,
} from '../../../core/application/ports/in/get-measurement-per-cabinet.input-port';
import { MeasurementNotFound } from '../../../core/domain/errors';

@injectable()
export class GetMeasurementPerCabinetController implements ExpressController {
  readonly route = '/api/measurement/:cabinetUid';
  readonly method = 'get';

  constructor(
    @inject(GET_MEASUREMENT_PER_CABINET_INPUT_PORT)
    private readonly _getMeasurementsPerCabinetService: GetMeasurementPerCabinetInputPort,
  ) {}
  async handler(req: Request, res: Response) {
    if (!isValidUuid(req.params.cabinetUid)) throw new httpErrors.BadRequest('cabinetUid must be an uuid');

    try {
      const resp = await this._getMeasurementsPerCabinetService.handler(req.params.cabinetUid);
      res.json(resp);
    } catch (error) {
      if (error instanceof MeasurementNotFound) throw new httpErrors.NotFound(error.message);
      throw error;
    }
  }
}
