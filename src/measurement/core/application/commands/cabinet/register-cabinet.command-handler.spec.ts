import { RegisterCabinetCommand } from './register-cabinet.command'
import { RegisterCabinetCommandHandler } from './register-cabinet.command-handler'
import { UUID_V4_REGEX } from '../../../../../shared/test/utils'
import { Owner } from '../../../domain/owner/owner'
import { Cabinet } from '../../../domain/cabinet/cabinet'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryOwnerRepository } from '../../../../adapters/out/persistence/owner/owner.repository.in-memory'
import { OwnerDoesNotExist } from '../../../domain/owner/errors'
import { CabinetAlreadyExists } from '../../../domain/cabinet/errors'

import Constructable = jest.Constructable

describe('Given a RegisterFrequencyCommand to handle', () => {
  const CABINET_UID = 'cabinet-uid'
  const BRAND_NAME = 'brand-name'
  const PRODUCT_NAME = 'product-name'
  const ENCLOSURE_TYPE = 'enclosure-type'
  const WEIGHT = 100
  const DIMENSION = 'dimension'
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

  const VALID_COMMAND = {
    brandName: BRAND_NAME,
    productName: PRODUCT_NAME,
    enclosureType: ENCLOSURE_TYPE,
    weight: WEIGHT,
    dimension: DIMENSION,
    description: DESCRIPTION,
    ownerUid: OWNER_UID,
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

  async function expectThrowError(
    command: RegisterCabinetCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
  }

  let cabinetRepository: InMemoryCabinetRepository
  let ownerRepository: InMemoryOwnerRepository
  let handler: RegisterCabinetCommandHandler

  const startDependenciesToInject = () => {
    ownerRepository = new InMemoryOwnerRepository()
    cabinetRepository = new InMemoryCabinetRepository()
  }

  const startHandler = () => {
    handler = new RegisterCabinetCommandHandler(
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
  })

  describe('When the owner does not exist', () => {
    let command: RegisterCabinetCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterCabinetCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, OwnerDoesNotExist)
    })
  })

  describe('When the cabinet already exists', () => {
    let command: RegisterCabinetCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      addCabinetToRepository()
      command = RegisterCabinetCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, CabinetAlreadyExists)
    })
  })

  describe('When the cabinet does not exist yet', () => {
    let command: RegisterCabinetCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      command = RegisterCabinetCommand.from(VALID_COMMAND)
    }

    it('Then it should save a new cabinet', async () => {
      await handler.execute(command)
      expect(cabinetRepository.toHaveBeenCalledWith()[0]).toEqual({
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        brandName: BRAND_NAME,
        productName: PRODUCT_NAME,
        enclosureType: ENCLOSURE_TYPE,
        weight: WEIGHT,
        dimension: DIMENSION,
        description: DESCRIPTION,
        ownerUid: OWNER_UID,
        updatedAt: expect.any(Date) as Date,
        createdAt: expect.any(Date) as Date,
      })
    })
  })
})
