import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';
import { ExpressController } from '../../../../shared/adapters/in/express-web-server';

import {
  GET_MEASUREMENT_PER_CABINET_INPUT_PORT,
  GetMeasurementPerCabinetInputPort,
  GetMeasurementPerCabinetInput,
} from '../../../core/application/ports/in/get-measurement-per-cabinet.input-port';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { FrequencyNotFound } from '../../../../frequency/core/domain/errors';
import { ImpedanceNotFound } from '../../../../impedance/core/domain/errors';

@injectable()
export class GetMeasurementPerCabinetController implements ExpressController {
  readonly route = '/api/measurement/measurement-per-cabinet';
  readonly method = 'get';

  constructor(
    @inject(GET_MEASUREMENT_PER_CABINET_INPUT_PORT)
    private readonly _getMeasurementsPerCabinetService: GetMeasurementPerCabinetInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    const { cabinetUid } = req.body as GetMeasurementPerCabinetInput;
    if (!cabinetUid) throw new httpErrors.BadRequest('cabinetUid cannot be empty');
    try {
      const response = await this._getMeasurementsPerCabinetService.handler(req.body as GetMeasurementPerCabinetInput);
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
