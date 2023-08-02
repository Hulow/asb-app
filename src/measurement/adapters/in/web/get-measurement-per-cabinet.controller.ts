import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';
import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import { validate as isValidUuid } from 'uuid';

import {
  GET_MEASUREMENT_PER_CABINET_INPUT_PORT,
  GetMeasurementPerCabinetInputPort,
} from '../../../core/application/ports/in/get-measurement-per-cabinet.input-port';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { FrequencyNotFound } from '../../../../frequency/core/domain/errors';
import { ImpedanceNotFound } from '../../../../impedance/core/domain/errors';

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
      const response = await this._getMeasurementsPerCabinetService.handler(req.params.cabinetUid);
      res.json(response);
    } catch (error) {
      if (error instanceof FrequencyNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof DriversNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof CabinetDoesNotExist) throw new httpErrors.NotFound(error.message);
      if (error instanceof ImpedanceNotFound) throw new httpErrors.NotFound(error.message);
      throw error;
    }
  }
}
