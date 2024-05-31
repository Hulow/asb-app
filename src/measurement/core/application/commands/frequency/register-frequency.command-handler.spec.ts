import * as fs from 'fs'
import * as path from 'path'

import Constructable = jest.Constructable
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryFrequencyRepository } from '../../../../adapters/out/persistence/frequency/frequency.repository.in-memory'
import { RegisterFrequencyCommandHandler } from './register-frequency.command-handler'
import { RegisterFrequencyMapper } from './register-frequency.mapper'
import { RegisterFrequencyCommand } from './register-frequency.command'
import { Cabinet } from '../../../domain/cabinet/cabinet'
import { Frequency } from '../../../domain/frequency/frequency'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import {
  FrequencyAlreadyExists,
  FrequencyParameterNotFound,
} from '../../../domain/frequency/errors'
import { UUID_V4_REGEX } from '../../../../../shared/test/utils'

describe('Given a RegisterFrequencyCommandHandler to handle', () => {
  const FREQUENCY_UID = 'frequency-uid'
  const OWNER_UID = 'owner-uid'
  const DRIVER_UID = 'driver-uid'
  const CABINET_UID = 'cabinet-uid'
  const MEASURED_BY = 'REW V5.20.13'
  const SOURCE = 'Scarlett 2i2 USB'
  const SWEEP_LENGTH = '512k Log Swept Sine'
  const MEASURED_AT = 'Mar 22, 2023 2:53:43 PM'
  const FREQUENCY_WEIGHTINGS = 'C-weighting'
  const TARGET_LEVEL = '75.0 dB'
  const NOTE = 'second measurement Mic is at 1m and almost align with tweeter'
  const SMOOTHING = '1/3 octave'
  const FREQUENCIES = [15.140533]
  const SPLS = [44.493]
  const MEASUREMENTS = fs.readFileSync(
    path.join(__dirname, './inputs/frequency_response.txt'),
    'utf8',
  )
  const UNVALID_MEASUREMENTS = fs.readFileSync(
    path.join(__dirname, './inputs/unvalid_frequency_response.txt'),
    'utf8',
  )

  const VALID_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: MEASUREMENTS,
  }

  const UNVALID_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: UNVALID_MEASUREMENTS,
  }

  let cabinetRepoStub: InMemoryCabinetRepository
  let frequencyRepoStub: InMemoryFrequencyRepository
  let handler: RegisterFrequencyCommandHandler
  let registerFrequencyMapper: RegisterFrequencyMapper

  const startDependenciesToInject = () => {
    cabinetRepoStub = new InMemoryCabinetRepository()
    frequencyRepoStub = new InMemoryFrequencyRepository()
    registerFrequencyMapper = new RegisterFrequencyMapper()
  }

  const startHandler = () => {
    handler = new RegisterFrequencyCommandHandler(
      frequencyRepoStub,
      cabinetRepoStub,
    )
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    cabinetRepoStub.clean()
    frequencyRepoStub.clean()
  })

  async function expectThrowError(
    command: RegisterFrequencyCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
  }

  function addCabinetToRepository(): Cabinet {
    const cabinet = {
      uid: CABINET_UID,
      brandName: 'string',
      productName: 'string',
      enclosureType: 'string',
      weight: 100,
      dimension: 'string',
      manufacturingYear: 2023,
      description: 'string',
      ownerUid: OWNER_UID,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    cabinetRepoStub.add(cabinet)
    return cabinet
  }

  function addFrequencyToRepository(): Frequency {
    const frequency = {
      uid: FREQUENCY_UID,
      measuredBy: MEASURED_BY,
      source: SOURCE,
      sweepLength: SWEEP_LENGTH,
      measuredAt: MEASURED_AT,
      frequencyWeightings: FREQUENCY_WEIGHTINGS,
      targetLevel: TARGET_LEVEL,
      note: NOTE,
      smoothing: SMOOTHING,
      frequencies: [15.140533],
      spls: [44.493],
      highestSpl: 44.493,
      lowestSpl: 44.493,
      phases: [86.8478],
      updatedAt: new Date(),
      createdAt: new Date(),
      cabinetUid: CABINET_UID,
    }
    frequencyRepoStub.add(frequency)
    return frequency
  }

  describe('When the cabinet from the frequency response does not exist', () => {
    let command: RegisterFrequencyCommand
    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterFrequencyCommand.from(VALID_COMMAND)
    }

    it('Then it should throw error', async () => {
      await expectThrowError(command, CabinetDoesNotExist)
    })
  })

  describe('When a frequency response already exists', () => {
    let command: RegisterFrequencyCommand
    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      addFrequencyToRepository()
      command = RegisterFrequencyCommand.from(VALID_COMMAND)
    }

    it('Then it should throw error', async () => {
      await expectThrowError(command, FrequencyAlreadyExists)
    })
  })

  describe('When the measurement file is not valid', () => {
    let command: RegisterFrequencyCommand
    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      command = RegisterFrequencyCommand.from(UNVALID_COMMAND)
    }

    it('Then it should throw error', async () => {
      await expectThrowError(command, FrequencyParameterNotFound)
    })
  })

  describe('When the measurement file is valid', () => {
    let command: RegisterFrequencyCommand
    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      command = RegisterFrequencyCommand.from(VALID_COMMAND)
    }

    it('Then it should store the frequency', async () => {
      await handler.execute(command)
      expect(frequencyRepoStub.toHaveBeenCalledWith()[0]).toEqual({
        cabinetUid: CABINET_UID,
        createdAt: expect.any(Date) as Date,
        frequencies: FREQUENCIES,
        frequencyWeightings: FREQUENCY_WEIGHTINGS,
        highestSpl: 44.493,
        lowestSpl: 44.493,
        measuredAt: MEASURED_AT,
        measuredBy: MEASURED_BY,
        note: NOTE,
        phases: [86.8478],
        smoothing: SMOOTHING,
        source: SOURCE,
        spls: SPLS,
        sweepLength: SWEEP_LENGTH,
        targetLevel: TARGET_LEVEL,
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        updatedAt: expect.any(Date) as Date,
      })
    })
  })
})
