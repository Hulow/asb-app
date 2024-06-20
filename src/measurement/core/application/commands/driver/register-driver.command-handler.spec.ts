import { Owner } from '../../../domain/owner/owner'
import { Cabinet } from '../../../domain/cabinet/cabinet'
import { Driver } from '../../../domain/driver/driver'
import { RegisterDriverCommand } from './register-driver.command'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryOwnerRepository } from '../../../../adapters/out/persistence/owner/owner.repository.in-memory'
import { InMemoryDriverRepository } from '../../../../adapters/out/persistence/driver/driver.repository.in-memory'
import { RegisterDriverCommandHandler } from './register-driver.command-handler'
import { OwnerDoesNotExist } from '../../../domain/owner/errors'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import { DriversAlreadyExists } from '../../../domain/driver/errors'
import { UUID_V4_REGEX } from '../../../../../shared/test/utils'

import Constructable = jest.Constructable

describe('Given a RegisterDriverCommand to handle', () => {
  const CABINET_UID = 'cabinet-uid'
  const BRAND_NAME = 'brand-name'
  const PRODUCT_NAME = 'product-name'
  const ENCLOSURE_TYPE = 'enclosure-type'
  const WEIGHT = 100
  const DIMENSION = 'dimension'
  const MANUFACTURING_YEAR = 2024
  const DESCRIPTION = 'description'
  const CREATED_AT = new Date()
  const UPDATED_AT = new Date()

  const OWNER_UID = 'owner-uid'
  const FIRST_NAME = 'first-name'
  const LAST_NAME = 'last-name'
  const OWNERNAME = 'ownername'
  const EMAIL = 'email'
  const PHONE_NUMBER = 'phone-number'
  const CITY = 'city'
  const DATE = new Date()

  const DRIVER_UID = 'driver-uid'
  const DRIVER_BRAND_NAME = 'brand-name'
  const DRIVER_PRODUCT_NAME = 'product-name'
  const DRIVER_TYPE = 'driver-type'
  const NOMINAL_DIAMETER = 12
  const NOMINAL_IMPEDANCE = 8
  const CONTINUOUS_POWER_HANDLING = 50

  const VALID_COMMAND = {
    brandName: DRIVER_BRAND_NAME,
    productName: DRIVER_PRODUCT_NAME,
    driverType: DRIVER_TYPE,
    nominalDiameter: NOMINAL_DIAMETER,
    nominalImpedance: NOMINAL_IMPEDANCE,
    continuousPowerHandling: CONTINUOUS_POWER_HANDLING,
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
  }

  function addOwnerToRepository(): Owner {
    const owner = {
      uid: OWNER_UID,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      ownername: OWNERNAME,
      email: EMAIL,
      phoneNumber: PHONE_NUMBER,
      city: CITY,
      description: DESCRIPTION,
      updatedAt: DATE,
      createdAt: DATE,
    }
    ownerRepository.add(owner)
    return owner
  }

  function addCabinetToRepository(): Cabinet {
    const cabinet = {
      uid: CABINET_UID,
      brandName: BRAND_NAME,
      productName: PRODUCT_NAME,
      enclosureType: ENCLOSURE_TYPE,
      weight: WEIGHT,
      dimension: DIMENSION,
      description: DESCRIPTION,
      ownerUid: OWNER_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    }
    cabinetRepository.add(cabinet)
    return cabinet
  }

  function addDriverToRepository(): Driver {
    const driver = {
      uid: DRIVER_UID,
      brandName: DRIVER_BRAND_NAME,
      productName: DRIVER_PRODUCT_NAME,
      driverType: DRIVER_TYPE,
      nominalDiameter: NOMINAL_DIAMETER,
      nominalImpedance: NOMINAL_IMPEDANCE,
      continuousPowerHandling: CONTINUOUS_POWER_HANDLING,
      cabinetUid: CABINET_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    }
    driverRepository.add(driver)
    return driver
  }

  async function expectThrowError(
    command: RegisterDriverCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
  }

  let cabinetRepository: InMemoryCabinetRepository
  let ownerRepository: InMemoryOwnerRepository
  let driverRepository: InMemoryDriverRepository
  let handler: RegisterDriverCommandHandler

  const startDependenciesToInject = () => {
    ownerRepository = new InMemoryOwnerRepository()
    cabinetRepository = new InMemoryCabinetRepository()
    driverRepository = new InMemoryDriverRepository()
  }

  const startHandler = () => {
    handler = new RegisterDriverCommandHandler(
      driverRepository,
      cabinetRepository,
      ownerRepository,
    )
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    ownerRepository.clean()
    cabinetRepository.clean()
    driverRepository.clean()
  })

  describe('When the owner does not exist', () => {
    let command: RegisterDriverCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterDriverCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, OwnerDoesNotExist)
    })
  })

  describe('When the cabinet does not exist', () => {
    let command: RegisterDriverCommand

    beforeEach(() => {
      startScenario()
    })
    const startScenario = () => {
      addOwnerToRepository()
      command = RegisterDriverCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, CabinetDoesNotExist)
    })
  })

  describe('When already 3 drivers already exist from the cabinet', () => {
    let command: RegisterDriverCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      addCabinetToRepository()
      addDriverToRepository()
      addDriverToRepository()
      addDriverToRepository()
      addDriverToRepository()
      command = RegisterDriverCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, DriversAlreadyExists)
    })
  })

  describe('When no driver belongs to the cabinet', () => {
    let command: RegisterDriverCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      addCabinetToRepository()
      command = RegisterDriverCommand.from(VALID_COMMAND)
    }

    it('Then it should create a driver', async () => {
      await handler.execute(command)
      expect(driverRepository.toHaveBeenCalledWith()[0]).toEqual({
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
        brandName: DRIVER_BRAND_NAME,
        productName: PRODUCT_NAME,
        driverType: DRIVER_TYPE,
        nominalDiameter: NOMINAL_DIAMETER,
        nominalImpedance: NOMINAL_IMPEDANCE,
        continuousPowerHandling: CONTINUOUS_POWER_HANDLING,
        cabinetUid: CABINET_UID,
      })
    })
  })

  describe('When 3 drivers already belong to the cabinet', () => {
    let command: RegisterDriverCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      addCabinetToRepository()
      addDriverToRepository()
      addDriverToRepository()
      addDriverToRepository()
      command = RegisterDriverCommand.from(VALID_COMMAND)
    }

    it('Then it should create a driver', async () => {
      await handler.execute(command)
      expect(driverRepository.toHaveBeenCalledWith()[0]).toEqual({
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
        brandName: DRIVER_BRAND_NAME,
        productName: PRODUCT_NAME,
        driverType: DRIVER_TYPE,
        nominalDiameter: NOMINAL_DIAMETER,
        nominalImpedance: NOMINAL_IMPEDANCE,
        continuousPowerHandling: CONTINUOUS_POWER_HANDLING,
        cabinetUid: CABINET_UID,
      })
    })
  })
})
