import { Cabinet } from '../../../domain/cabinet/cabinet'
import Constructable = jest.Constructable
import { Owner } from '../../../domain/owner/owner'
import { Driver } from '../../../domain/driver/driver'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryOwnerRepository } from '../../../../adapters/out/persistence/owner/owner.repository.in-memory'
import { InMemoryDriverRepository } from '../../../../adapters/out/persistence/driver/driver.repository.in-memory'
import { GetCabinetQueryHandler } from './get-cabinets.query-handler'
import { OwnersNotFound } from '../../../domain/owner/errors'
import { CabinetsNotFound } from '../../../domain/cabinet/errors'
import { DriversNotFound } from '../../../domain/driver/errors'

describe('Given a GetCabinets to query', () => {
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
      manufacturingYear: MANUFACTURING_YEAR,
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
      manufacturingYear: MANUFACTURING_YEAR,
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

  async function expectThrowError(errorType: Constructable) {
    await expect(query.execute()).rejects.toThrow(errorType)
  }

  let cabinetRepository: InMemoryCabinetRepository
  let ownerRepository: InMemoryOwnerRepository
  let driverRepository: InMemoryDriverRepository
  let query: GetCabinetQueryHandler

  const startDependenciesToInject = () => {
    ownerRepository = new InMemoryOwnerRepository()
    cabinetRepository = new InMemoryCabinetRepository()
    driverRepository = new InMemoryDriverRepository()
  }

  const startHandler = () => {
    query = new GetCabinetQueryHandler(
      cabinetRepository,
      ownerRepository,
      driverRepository,
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

  describe('When there is not any owners', () => {
    it('Then it should throw an error', async () => {
      await expectThrowError(OwnersNotFound)
    })
  })

  describe('When there is not any cabinets', () => {
    it('Then it should throw an error', async () => {
      addOwnerToRepository()
      await expectThrowError(CabinetsNotFound)
    })
  })

  describe('When there is not any drivers', () => {
    it('Then it should throw an error', async () => {
      addOwnerToRepository()
      addCabinetToRepository()
      await expectThrowError(DriversNotFound)
    })
  })

  describe('When a owner owns a cabinet and a driver', () => {
    it('Then it should throw an error', async () => {
      addOwnerToRepository()
      addCabinetToRepository()
      addDriverToRepository()
      const response = await query.execute()
      expect(response).toEqual([
        {
          cabinet: {
            uid: CABINET_UID,
            brandName: BRAND_NAME,
            productName: PRODUCT_NAME,
            enclosureType: ENCLOSURE_TYPE,
            weight: WEIGHT,
            dimension: DIMENSION,
            manufacturingYear: MANUFACTURING_YEAR,
            description: DESCRIPTION,
            ownerUid: OWNER_UID,
            createdAt: expect.any(Date) as Date,
            updatedAt: expect.any(Date) as Date,
          },
          owner: {
            uid: OWNER_UID,
            firstName: FIRST_NAME,
            lastName: LAST_NAME,
            ownername: OWNERNAME,
            email: EMAIL,
            phoneNumber: PHONE_NUMBER,
            city: CITY,
            description: DESCRIPTION,
            updatedAt: expect.any(Date) as Date,
            createdAt: expect.any(Date) as Date,
          },
          drivers: [
            {
              uid: DRIVER_UID,
              brandName: DRIVER_BRAND_NAME,
              productName: DRIVER_PRODUCT_NAME,
              driverType: DRIVER_TYPE,
              manufacturingYear: MANUFACTURING_YEAR,
              nominalDiameter: NOMINAL_DIAMETER,
              nominalImpedance: NOMINAL_IMPEDANCE,
              continuousPowerHandling: CONTINUOUS_POWER_HANDLING,
              cabinetUid: CABINET_UID,
              createdAt: expect.any(Date) as Date,
              updatedAt: expect.any(Date) as Date,
            },
          ],
        },
      ])
    })
  })
})
