import * as fs from 'fs'
import * as path from 'path'

import { Cabinet } from '../../../domain/cabinet/cabinet'
import { Impedance } from '../../../domain/impedance/impedance'
import { RegisterImpedanceCommand } from './register-impedance.command'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryImpedanceRepository } from '../../../../adapters/out/persistence/impedance/impedance.repository.in-memory'
import { RegisterImpedanceCommandHandler } from './register-impedance.command-handler'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import {
  ImpedanceAlreadyExists,
  ImpedanceParameterNotFound,
} from '../../../domain/impedance/errors'

import Constructable = jest.Constructable

describe('Given a RegisterImpedanceCommand to handle', () => {
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

  const IMPEDANCE_UID = 'impedance-uid'
  const SOURCE = 'DATS'
  const PISTON_DIAMETER = '393'
  const RESONANCE_FREQUENCY = '40.17'
  const DC_RESISTANCE = '5.107'
  const AC_RESISTANCE = '151.4'
  const MECHANICAL_DAMPING = '0.4587'
  const ELECTRICAL_DAMPING = '0.4587'
  const TOTAL_DAMPING = '0.4432'
  const EQUIVALENCE_COMPLIANCE = '173'
  const VOICE_COIL_INDUCTANCE = '1.473'
  const EFFICIENCY = '2.331'
  const SENSITIVITY = '95.78'
  const CONE_MASS = '187.5'
  const SUSPENSION_COMPLIANCE = '0.084'
  const FORCE_FACTOR = '22.95'
  const KR = '0.05354'
  const XR = '0.5762'
  const KI = '0.04204'
  const XI = '0.6239'

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
      manufacturingYear: MANUFACTURING_YEAR,
      description: DESCRIPTION,
      ownerUid: OWNER_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    }
    cabinetRepository.add(cabinet)
    return cabinet
  }

  function addImpedanceToRepository(): Impedance {
    const impedance = {
      uid: IMPEDANCE_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
      source: SOURCE,
      pistonDiameter: PISTON_DIAMETER,
      resonanceFrequency: RESONANCE_FREQUENCY,
      dcResistance: DC_RESISTANCE,
      acResistance: AC_RESISTANCE,
      mechanicalDamping: MECHANICAL_DAMPING,
      electricalDamping: ELECTRICAL_DAMPING,
      totalDamping: TOTAL_DAMPING,
      equivalenceCompliance: EQUIVALENCE_COMPLIANCE,
      voiceCoilInductance: VOICE_COIL_INDUCTANCE,
      efficiency: EFFICIENCY,
      sensitivity: SENSITIVITY,
      coneMass: CONE_MASS,
      suspensionCompliance: SUSPENSION_COMPLIANCE,
      forceFactor: FORCE_FACTOR,
      kR: KR,
      xR: XR,
      kI: KI,
      xI: XI,
      cabinetUid: CABINET_UID,
      frequencies: [1, 1.029],
      highestFrequency: 1.029,
      lowestFrequency: 1,
      impedances: [5, 5.108],
      lowestImpedance: 5,
      highestImpedance: 5.108,
      phases: [4, 4.975],
    }
    impedanceRepository.add(impedance)
    return impedance
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

  describe('When the impedance already exists', () => {
    let command: RegisterImpedanceCommand

    beforeEach(() => {
      addCabinetToRepository()
      addImpedanceToRepository()
      startScenario()
    })

    const startScenario = () => {
      command = RegisterImpedanceCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, ImpedanceAlreadyExists)
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
