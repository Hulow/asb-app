import { inject, injectable } from 'inversify'

import {
  GetCabinetQueryResult,
  CabinetQueryResult,
} from './get-cabinets.query-result'
import { GetCabinetsInputPort } from '../../ports/in/get-cabinets.input-port'
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../ports/out/cabinet-repository.output-port'
import {
  OWNER_REPOSITORY_OUTPUT_PORT,
  OwnerRepositoryOutputPort,
} from '../../ports/out/owner-repository.output-port'
import {
  DRIVER_REPOSITORY_OUTPUT_PORT,
  DriverRepositoryOutputPort,
} from '../../ports/out/driver-repository.output-port'
import { OwnersNotFound } from '../../../domain/owner/errors'
import { CabinetsNotFound } from '../../../domain/cabinet/errors'
import { DriversNotFound } from '../../../domain/driver/errors'

@injectable()
export class GetCabinetQueryHandler implements GetCabinetsInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT)
    private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT)
    private readonly _ownerRepository: OwnerRepositoryOutputPort,
    @inject(DRIVER_REPOSITORY_OUTPUT_PORT)
    private readonly _driverRepository: DriverRepositoryOutputPort,
  ) {}

  async execute(): Promise<CabinetQueryResult[]> {
    const owners = await this._ownerRepository.getAllOwners()
    if (!owners) {
      throw new OwnersNotFound()
    }
    const cabinets = await this._cabinetRepository.getAllCabinets()
    if (!cabinets) {
      throw new CabinetsNotFound()
    }

    const drivers = await this._driverRepository.getAllDrivers()
    if (!drivers) {
      throw new DriversNotFound()
    }

    return new GetCabinetQueryResult().map(owners, cabinets, drivers)
  }
}
