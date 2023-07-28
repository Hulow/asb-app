import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';

import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import {
  GetCabinetsPerOwnerInputPort,
  GET_CABINETS_PER_OWNER_INPUT_PORT,
} from '../../../core/application/ports/in/get-cabinets-per-owner.input-port';

import { CabinetsFromOwnerNotFound } from '../../../core/domain/errors';
import { OwnerDoesNotExist } from '../../../../owner/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';

interface GetCabinetsPerOwnerBody {
  ownername: string;
}

@injectable()
export class GetCabinetsPerOwnerController implements ExpressController {
  readonly route = '/api/cabinets-per-owner';
  readonly method = 'get';

  constructor(
    @inject(GET_CABINETS_PER_OWNER_INPUT_PORT)
    private readonly getCabinetsPerOwnerService: GetCabinetsPerOwnerInputPort,
  ) {}
  async handler(req: Request<unknown, unknown, GetCabinetsPerOwnerBody>, res: Response) {
    const { ownername } = req.body;
    if (!ownername) throw new httpErrors.BadRequest('ownername cannot be empty');
    try {
      const response = await this.getCabinetsPerOwnerService.handler(ownername);
      res.json(response);
    } catch (error) {
      if (error instanceof OwnerDoesNotExist) throw new httpErrors.NotFound(error.message);
      if (error instanceof CabinetsFromOwnerNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof DriversNotFound) throw new httpErrors.NotFound(error.message);

      throw error;
    }
  }
}
