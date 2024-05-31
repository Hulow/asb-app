import { inject, injectable } from 'inversify'

import { RegisterDriverCommand } from './register-driver.command'
import { RegisterDriverInputPort } from '../../ports/in/register-driver.input-port'
import { DRIVER_REPOSITORY_OUTPUT_PORT, DriverRepositoryOutputPort } from '../../ports/out/driver-repository.output-port'
import { CABINET_REPOSITORY_OUTPUT_PORT, CabinetRepositoryOutputPort } from '../../ports/out/cabinet-repository.output-port'
import { OWNER_REPOSITORY_OUTPUT_PORT, OwnerRepositoryOutputPort } from '../../ports/out/owner-repository.output-port'
import { Driver } from '../../../domain/driver/driver'
import { OwnerDoesNotExist } from '../../../domain/owner/errors'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import { DriversAlreadyExists } from '../../../domain/driver/errors'

@injectable()
export class RegisterDriverCommandHandler implements RegisterDriverInputPort {
  constructor(
    @inject(DRIVER_REPOSITORY_OUTPUT_PORT)
    private readonly _driverRepository: DriverRepositoryOutputPort,
    @inject(CABINET_REPOSITORY_OUTPUT_PORT)
    private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT)
    private readonly _ownerRepository: OwnerRepositoryOutputPort,
  ) {}

  async execute(command: RegisterDriverCommand): Promise<Driver> {
    const driver = new Driver({ ...command })

    const existingOwner = await this._ownerRepository.getById(command.ownerUid)
    if (!existingOwner) {
      throw new OwnerDoesNotExist(command.ownerUid)
    }

    const existingCabinet = await this._cabinetRepository.getById(
      command.cabinetUid,
    )
    if (!existingCabinet) {
      throw new CabinetDoesNotExist(command.cabinetUid)
    }

    const existingDrivers =
      await this._driverRepository.getByProductNameAndCabinetUid(
        command.productName,
        command.cabinetUid,
      )

    if (existingDrivers && existingDrivers.length > 3) {
      throw new DriversAlreadyExists(
        existingDrivers.length,
        existingDrivers[0].productName,
        existingDrivers[0].cabinetUid,
      )
    }

    return await this._driverRepository.save(driver)
  }
}
