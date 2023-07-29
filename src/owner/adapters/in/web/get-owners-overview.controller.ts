import { Request, Response } from 'express';
import httpErrors from 'http-errors';
import { inject, injectable } from 'inversify';
import { ExpressController } from '../../../../shared/adapters/in/express-web-server';
import {
  GetOwnersOverviewInputPort,
  GET_OWNERS_OVERVIEW_INPUT_PORT,
} from '../../../core/application/ports/in/get-owners-overview.input-port';
import { OwnersNotFound } from '../../../core/domain/errors';
import { CabinetsNotFound } from '../../../../cabinet/core/domain/errors';

@injectable()
export class GetOwnersOverviewController implements ExpressController {
  readonly route = '/api/owners-overview';
  readonly method = 'get';

  constructor(
    @inject(GET_OWNERS_OVERVIEW_INPUT_PORT)
    private readonly getOwnersCollectionOverviewService: GetOwnersOverviewInputPort,
  ) {}
  async handler(req: Request<unknown, unknown>, res: Response) {
    try {
      const response = await this.getOwnersCollectionOverviewService.handler();
      res.json(response);
    } catch (error) {
      if (error instanceof OwnersNotFound) throw new httpErrors.NotFound(error.message);
      if (error instanceof CabinetsNotFound) throw new httpErrors.NotFound(error.message);
      throw error;
    }
  }
}
