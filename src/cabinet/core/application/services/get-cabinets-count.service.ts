import { inject, injectable } from 'inversify';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/cabinet-repository.output-port';

import { CabinetsNotFound } from '../../domain/errors';
import { GetCabinetCountInputPort } from '../../../../frequency/core/application/ports/in/get-cabinets-count.input-port';

@injectable()
export class GetCabinetsCount implements GetCabinetCountInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly _cabinetRepository: CabinetRepositoryOutputPort,
  ) {}

  async handler(): Promise<number> {
    const cabinets = await this._cabinetRepository.getAllCabinets();
    if (!cabinets) throw new CabinetsNotFound();
    return cabinets.length;
  }
}
