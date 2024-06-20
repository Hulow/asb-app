import * as fs from 'fs'
import * as path from 'path'

import { RegisterImpulseCommand } from './register-impulse.command'

import { Cabinet } from '../../../domain/cabinet/cabinet'
import { Impulse } from '../../../domain/impulse/impulse'
import { InMemoryCabinetRepository } from '../../../../adapters/out/persistence/cabinet/cabinet.repository.in-memory'
import { InMemoryImpulseRepository } from '../../../../adapters/out/persistence/impulse/impulse.repository.in-memory'
import { RegisterImpulseCommandHandler } from './register-impulse.command-handler'
import { CabinetDoesNotExist } from '../../../domain/cabinet/errors'
import {
  ImpulseAlreadyExists,
  ImpulseSettingNotFound,
  MissingImpulseGraphDataFound,
} from '../../../domain/impulse/errors'
import { UUID_V4_REGEX } from '../../../../../shared/test/utils'

import Constructable = jest.Constructable

describe('Given a RegisterImpulseCommand to handle', () => {
  const DRIVER_UID = 'driver-uid'
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
  const VALID_MEASUREMENT = fs.readFileSync(
    path.join(__dirname, './inputs/impulse_response.txt'),
    'utf8',
  )
  const UNVALID_SETTING_MEASUREMENT = fs.readFileSync(
    path.join(__dirname, './inputs/impulse_response_with_missing_setting.txt'),
    'utf8',
  )
  const UNVALID_DATA_MEASUREMENT = fs.readFileSync(
    path.join(__dirname, './inputs/wrong_impulse_response.txt'),
    'utf8',
  )

  const IMPULSE_UID = 'impulse-uid'
  const MEASURED_BY = 'REW V5.20.13'
  const NOTE = 'impulse_response'
  const SOURCE = 'Scarlett 2i2 USB'
  const MEASURED_AT = 'Mar 22, 2023 2:53:43 PM'
  const SWEEP_LENGTH = '512k Log Swept Sine'
  const RESPONSE_WINDOW = '15.1 to 20,000.0 Hz'
  const PEAK_VALUE_BEFORE_INITIALIZATION = '0.1058686152100563'
  const PEAK_INDEX = '5513'
  const RESPONSE_LENGTH = '4'
  const SAMPLE_INTERVAL = '2.2675736961451248E-5'
  const START_TIME = '-0.12501133786848073'

  const VALID_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: VALID_MEASUREMENT,
  }

  const UNVALID_SETTING_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: UNVALID_SETTING_MEASUREMENT,
  }

  const UNVALID_DATA_COMMAND = {
    ownerUid: OWNER_UID,
    cabinetUid: CABINET_UID,
    driverUid: DRIVER_UID,
    measurements: UNVALID_DATA_MEASUREMENT,
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

  function addImpulseToRepository(): Impulse {
    const impulse = {
      uid: IMPULSE_UID,
      measuredBy: MEASURED_BY,
      note: NOTE,
      source: SOURCE,
      measuredAt: MEASURED_AT,
      sweepLength: SWEEP_LENGTH,
      responseWindow: RESPONSE_WINDOW,
      measurements: [
        { dbfs: 0, time: -0.12501133786848073 },
        { dbfs: 1.1946093e-11, time: -0.12498866213151928 },
        { dbfs: 4.6445597e-11, time: -0.12496598639455783 },
        { dbfs: 1.6116244e-10, time: -0.12494331065759638 },
      ],
      peakValueBeforeInitialization: PEAK_VALUE_BEFORE_INITIALIZATION,
      peakIndex: PEAK_INDEX,
      responseLength: RESPONSE_LENGTH,
      sampleInterval: SAMPLE_INTERVAL,
      startTime: START_TIME,
      cabinetUid: CABINET_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    }
    impulseRepository.add(impulse)
    return impulse
  }

  async function expectThrowError(
    command: RegisterImpulseCommand,
    errorType: Constructable,
  ) {
    await expect(handler.execute(command)).rejects.toThrow(errorType)
  }

  let cabinetRepository: InMemoryCabinetRepository
  let impulseRepository: InMemoryImpulseRepository
  let handler: RegisterImpulseCommandHandler

  const startDependenciesToInject = () => {
    cabinetRepository = new InMemoryCabinetRepository()
    impulseRepository = new InMemoryImpulseRepository()
  }

  const startHandler = () => {
    handler = new RegisterImpulseCommandHandler(
      impulseRepository,
      cabinetRepository,
    )
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    cabinetRepository.clean()
    impulseRepository.clean()
  })

  describe('When the cabinet does not exist', () => {
    let command: RegisterImpulseCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      command = RegisterImpulseCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, CabinetDoesNotExist)
    })
  })

  describe('When the impulse already exists', () => {
    let command: RegisterImpulseCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      addImpulseToRepository()
      command = RegisterImpulseCommand.from(VALID_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, ImpulseAlreadyExists)
    })
  })

  describe('When the impulse contains missing settings', () => {
    let command: RegisterImpulseCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      command = RegisterImpulseCommand.from(UNVALID_SETTING_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, ImpulseSettingNotFound)
    })
  })

  describe('When the impulse contains missing data', () => {
    let command: RegisterImpulseCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      command = RegisterImpulseCommand.from(UNVALID_DATA_COMMAND)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(command, MissingImpulseGraphDataFound)
    })
  })

  describe('When the impulse contains the right settings and data', () => {
    let command: RegisterImpulseCommand

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addCabinetToRepository()
      command = RegisterImpulseCommand.from(VALID_COMMAND)
    }

    it('Then it save the response', async () => {
      await handler.execute(command)
      expect(impulseRepository.toHaveBeenCalledWith()[0]).toEqual({
        uid: expect.stringMatching(UUID_V4_REGEX) as string,
        measuredBy: MEASURED_BY,
        note: NOTE,
        source: SOURCE,
        measuredAt: MEASURED_AT,
        sweepLength: SWEEP_LENGTH,
        responseWindow: RESPONSE_WINDOW,
        measurements: [
          { dbfs: 0, time: -0.12501133786848073 },
          { dbfs: 1.1946093e-11, time: -0.12498866213151928 },
          { dbfs: 4.6445597e-11, time: -0.12496598639455783 },
          { dbfs: 1.6116244e-10, time: -0.12494331065759638 },
        ],
        peakValueBeforeInitialization: PEAK_VALUE_BEFORE_INITIALIZATION,
        peakIndex: PEAK_INDEX,
        responseLength: RESPONSE_LENGTH,
        sampleInterval: SAMPLE_INTERVAL,
        startTime: START_TIME,
        cabinetUid: CABINET_UID,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      })
    })
  })
})
