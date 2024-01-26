import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';

import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import {
  REGISTER_CABINET_INPUT_PORT,
  RegisterCabinetInput,
} from '../../../core/application/ports/in/register-cabinet.input-port';
import { CabinetsNotFound } from '../../../core/domain/errors';
import { GetCabinetCountInputPort } from '../../../../frequency/core/application/ports/in/get-cabinets-count.input-port';

@injectable()
export class GetCabinetsCountController implements ExpressController {
  readonly route = '/cabinets-count';
  readonly method = 'get';

  constructor(
    @inject(REGISTER_CABINET_INPUT_PORT) private readonly _getCabinetCountService: GetCabinetCountInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    req.body as RegisterCabinetInput;

    try {
      const response = await this._getCabinetCountService.handler();
      res.json(response);
    } catch (error) {
      if (error instanceof CabinetsNotFound) throw new httpErrors.NotFound(error.message);
      throw error;
    }
  }
}
