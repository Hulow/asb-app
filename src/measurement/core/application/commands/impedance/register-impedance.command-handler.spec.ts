import * as fs from 'fs'
import * as path from 'path'

import { Cabinet } from '../../../domain/cabinet/cabinet'
import { RegisterImpedanceCommand } from './register-impedance.command'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryImpedanceRepository } from '../../../../adapters/out/persistence/impedance/impedance.repository.in-memory'
import { RegisterImpedanceCommandHandler } from './register-impedance.command-handler'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import { ImpedanceParameterNotFound } from '../../../domain/impedance/errors'

import Constructable = jest.Constructable

describe('Given a RegisterImpedanceCommand to handle', () => {
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
  const DRIVER_UID = 'driver-uid'
  const VALID_MEASUREMENT = fs.readFileSync(
    path.join(__dirname, './inputs/valid_impedance_response.txt'),
    'utf8',
  )
  const UNVALID_TSP_MEASUREMENT = fs.readFileSync(
    path.join(__dirname, './inputs/unvalid_tsp_impedance_response.txt'),
    'utf8',
  )

  const VALID_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: VALID_MEASUREMENT,
  }

  const UNVALID_TSP_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: UNVALID_TSP_MEASUREMENT,
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
    command: RegisterImpedanceCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
  }

  let cabinetRepository: InMemoryCabinetRepository
  let impedanceRepository: InMemoryImpedanceRepository
  let handler: RegisterImpedanceCommandHandler

  const startDependenciesToInject = () => {
    cabinetRepository = new InMemoryCabinetRepository()
    impedanceRepository = new InMemoryImpedanceRepository()
  }

  const startHandler = () => {
    handler = new RegisterImpedanceCommandHandler(
      impedanceRepository,
      cabinetRepository,
    )
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    cabinetRepository.clean()
    impedanceRepository.clean()
  })

  describe('When the cabinet does not exist', () => {
    let command: RegisterImpedanceCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterImpedanceCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, CabinetDoesNotExist)
    })
  })

  describe('When the impedance contains a missing TSP', () => {
    let command: RegisterImpedanceCommand

    beforeEach(() => {
      addCabinetToRepository()
      startScenario()
    })

    const startScenario = () => {
      command = RegisterImpedanceCommand.from(UNVALID_TSP_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, ImpedanceParameterNotFound)
    })
  })
})
