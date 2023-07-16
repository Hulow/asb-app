import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';

import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import {
  GetOwnersCollectionOverviewInputPort,
  GET_OWNERS_COLLECTION_OVERVIEW_INPUT_PORT,
} from '../../../core/application/ports/in/get-owners-collection-overview.input-port';

import { OwnersNotFound } from '../../../core/domain/errors';
import { CabinetsNotFound } from '../../../../cabinet/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';

@injectable()
export class GetOwnersCollectionOverviewController implements ExpressController {
  readonly route = '/api/owners-collection';
  readonly method = 'get';

  constructor(
    @inject(GET_OWNERS_COLLECTION_OVERVIEW_INPUT_PORT)
    private readonly getOwnersCollectionOverviewService: GetOwnersCollectionOverviewInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    try {
      const response = await this.getOwnersCollectionOverviewService.handler();
      res.json(response);
    } catch (error) {
      if (error instanceof OwnersNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof CabinetsNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof DriversNotFound) throw new httpErrors.NotFound(error.message);

      throw error;
    }
  }
}
