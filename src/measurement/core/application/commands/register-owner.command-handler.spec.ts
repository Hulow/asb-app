import { RegisterOwnerCommand } from './register-owner.command'
import { RegisterOwnerCommandHandler } from './register-owner.command-handler'
import { UUID_V4_REGEX } from '../../../../shared/test/utils'

import Constructable = jest.Constructable
import { InMemoryOwnerRepository } from '../../../adapters/out/persistence/owner/owner.repository.in-memory'
import { Owner } from '../../domain/owner/owner'
import { OwnerAlreadyExists } from '../../domain/owner/errors'

describe('Given a RegisterOwnerCommand to handle', () => {
  const OWNER_UID = 'owner-uid'
  const FIRST_NAME = 'first-name'
  const LAST_NAME = 'last-name'
  const OWNERNAME = 'ownername'
  const EMAIL = 'email'
  const PHONE_NUMBER = 'phone-number'
  const CITY = 'city'
  const DESCRIPTION = 'description'
  const DATE = new Date()

  const VALID_COMMAND = {
    firstName: FIRST_NAME,
    lastName: LAST_NAME,
    ownername: OWNERNAME,
    email: EMAIL,
    phoneNumber: PHONE_NUMBER,
    city: CITY,
    description: DESCRIPTION,
  }

  let ownerRepository: InMemoryOwnerRepository
  let handler: RegisterOwnerCommandHandler

  const startDependenciesToInject = () => {
    ownerRepository = new InMemoryOwnerRepository()
  }

  const startHandler = () => {
    handler = new RegisterOwnerCommandHandler(ownerRepository)
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    ownerRepository.clean()
  })

  async function expectThrowError(
    command: RegisterOwnerCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
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

  describe('When the owner already exist', () => {
    let command: RegisterOwnerCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addOwnerToRepository()
      command = RegisterOwnerCommand.from(VALID_COMMAND)
    }
    it('Then it should throw an error', async () => {
      await expectThrowError(command, OwnerAlreadyExists)
    })
  })

  describe('When the owner already exist', () => {
    let command: RegisterOwnerCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterOwnerCommand.from(VALID_COMMAND)
    }
    it('Then it should save a new owner', async () => {
      await handler.execute(command)
      expect(ownerRepository.toHaveBeenCalledWith()[0]).toEqual({
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
        ownername: OWNERNAME,
        email: EMAIL,
        phoneNumber: PHONE_NUMBER,
        city: CITY,
        description: DESCRIPTION,
        updatedAt: expect.any(Date) as Date,
        createdAt: expect.any(Date) as Date,
      })
    })
  })
})
