import { GetMeasurementQueryHandler } from './get-measurement.query-handler'
import { GetMeasurementQuery } from './get-measurement.query'
import { Measurement } from '../../../domain/measurement/measurement'
import { InMemoryMeasurementRepository } from '../../../../adapters/out/persistence/measurement/measurement.repository.in-memory'
import { MeasurementNotFound } from '../../../domain/measurement/errors'

import Constructable = jest.Constructable

describe('Given a GetMeasurementQuery to handle', () => {
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

  const DRIVER_UID = 'driver-uid'
  const DRIVER_BRAND_NAME = 'brand-name'
  const DRIVER_PRODUCT_NAME = 'product-name'
  const DRIVER_TYPE = 'driver-type'
  const NOMINAL_DIAMETER = 12
  const NOMINAL_IMPEDANCE = 8
  const CONTINUOUS_POWER_HANDLING = 50

  const FREQUENCY_UID = 'frequency-uid'
  const MEASURED_BY = 'REW V5.20.13'
  const SOURCE = 'Scarlett 2i2 USB'
  const SWEEP_LENGTH = '512k Log Swept Sine'
  const MEASURED_AT = 'Mar 22, 2023 2:53:43 PM'
  const FREQUENCY_WEIGHTINGS = 'C-weighting'
  const TARGET_LEVEL = '75.0 dB'
  const NOTE = 'second measurement Mic is at 1m and almost align with tweeter'
  const SMOOTHING = '1/3 octave'

  const IMPEDANCE_UID = 'impedance-uid'
  const IMPEDANCE_SOURCE = 'DATS'
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

  const VALID_QUERY = { cabinetUid: 'cabinet-uid' }

  const measurement = {
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
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
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
        createdAt: CREATED_AT,
        updatedAt: UPDATED_AT,
      },
    ],
    frequency: {
      uid: FREQUENCY_UID,
      measuredBy: MEASURED_BY,
      source: SOURCE,
      sweepLength: SWEEP_LENGTH,
      measuredAt: MEASURED_AT,
      frequencyWeightings: FREQUENCY_WEIGHTINGS,
      targetLevel: TARGET_LEVEL,
      note: NOTE,
      smoothing: SMOOTHING,
      frequencies: [10, 15.140533],
      highestFrequency: 15.140533,
      lowestFrequency: 10,
      spls: [44.493],
      highestSpl: 44.493,
      lowestSpl: 44.493,
      phases: [86.8478],
      updatedAt: new Date(),
      createdAt: new Date(),
      cabinetUid: CABINET_UID,
    },
    impedance: {
      uid: IMPEDANCE_UID,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
      source: IMPEDANCE_SOURCE,
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
      lowestPhase: 4,
      highestPhase: 4.975,
    },
  }

  function addMeasurementToRepository(): Measurement {
    measurementRepository.add(measurement)
    return measurement
  }

  async function expectThrowError(
    query: GetMeasurementQuery,
    errorType: Constructable,
  ) {
    await expect(handler.execute(query)).rejects.toThrow(errorType)
  }

  let measurementRepository: InMemoryMeasurementRepository
  let handler: GetMeasurementQueryHandler

  const startDependenciesToInject = () => {
    measurementRepository = new InMemoryMeasurementRepository()
  }

  const startHandler = () => {
    handler = new GetMeasurementQueryHandler(measurementRepository)
  }

  beforeAll(() => {
    startDependenciesToInject()
    startHandler()
  })

  beforeEach(() => {
    measurementRepository.clean()
  })

  describe('When the measurement has not been found', () => {
    let query: GetMeasurementQuery

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      query = GetMeasurementQuery.from(VALID_QUERY)
    }

    it('Then it should throw an error', async () => {
      await expectThrowError(query, MeasurementNotFound)
    })
  })

  describe('When the measurement has been found', () => {
    let query: GetMeasurementQuery

    beforeEach(() => {
      startScenario()
    })

    const startScenario = () => {
      addMeasurementToRepository()
      query = GetMeasurementQuery.from(VALID_QUERY)
    }

    it('Then it returns a measurement', async () => {
      const response = await handler.execute(query)
      expect(response).toEqual(measurement)
    })
  })
})
