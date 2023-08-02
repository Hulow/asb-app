import { InMemoryCabinetRepository } from '../../../../cabinet/adapters/out/persistence/cabinet.repository.in-memory';
import { InMemoryDriverRepository } from '../../../../driver/adapters/out/persistence/driver.repository.in-memory';
import { InMemoryFrequencyRepository } from '../../../../frequency/adapters/out/persistence/frequency.repository.in-memory';
import { InMemoryImpedanceRepository } from '../../../../impedance/adapters/out/persistence/impedance.repository.in-memory';
import { GetMeasurementPerCabinetService } from './get-measurement-per-cabinet.service';
import { Measurement } from '../../domain/measurement';
import { Cabinet } from '../../../../cabinet/core/domain/cabinet';
import { Driver } from '../../../../driver/core/domain/driver';
import { Impedance } from '../../../../impedance/core/domain/impedance';
import { Frequency } from '../../../../frequency/core/domain/frequency';
import { CabinetDoesNotExist } from '../../../../cabinet/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { FrequencyNotFound } from '../../../../frequency/core/domain/errors';
import { ImpedanceNotFound } from '../../../../impedance/core/domain/errors';

function createCabinet(cabinetUid: number, payload: object): Cabinet {
  return {
    uid: `cabinet-${cabinetUid}`,
    brandName: 'Clauz',
    productName: 'die Maschine',
    enclosureType: 'Poccochin',
    weight: 100,
    dimension: 'dimension',
    manufacturingYear: 2023,
    description: 'description',
    ownerUid: `owner`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
}

function createDriver(cabinetUid: number, payload: object): Driver {
  return {
    uid: `uid`,
    brandName: 'B&C',
    productName: '12PE32',
    driverType: 'Woofer',
    manufacturingYear: 2015,
    nominalDiameter: 12,
    nominalImpedance: 8,
    continuousPowerHandling: 500,
    cabinetUid: `cabinet-${cabinetUid}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
}

function createFrequency(cabinetUid: number, payload: object): Frequency {
  return {
    uid: 'uid',
    measuredBy: 'string',
    source: 'string',
    sweepLength: 'string',
    measuredAt: 'string',
    frequencyWeightings: 'string',
    targetLevel: 'string',
    note: 'string',
    smoothing: 'string',
    measurements: [{ phase: 1, spl: 1, frequency: 1 }],
    cabinetUid: `cabinet-${cabinetUid}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
}

function createImpedance(cabinetUid: number, payload: object): Impedance {
  return {
    uid: 'uid',
    source: 'string',
    pistonDiameter: 'string',
    resonanceFrequency: 'string',
    dcResistance: 'string',
    acResistance: 'string',
    mechanicalDamping: 'string',
    electricalDamping: 'string',
    totalDamping: 'string',
    equivalenceCompliance: 'string',
    voiceCoilInductance: 'string',
    efficiency: 'string',
    sensitivity: 'string',
    coneMass: 'string',
    suspensionCompliance: 'string',
    forceFactor: 'string',
    kR: 'string',
    xR: 'string',
    kI: 'string',
    xI: 'string',
    cabinetUid: `cabinet-${cabinetUid}`,
    impedanceCurve: [{ phase: 1, impedance: 1, frequency: 1 }],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
}

describe('GetMeasurementPerCabinetService', () => {
  let cabinetRepoStub: InMemoryCabinetRepository;
  let driverRepoStub: InMemoryDriverRepository;
  let impedanceRepoStub: InMemoryImpedanceRepository;
  let frequencyRepoStub: InMemoryFrequencyRepository;
  let getMeasurementPerCabinetService: GetMeasurementPerCabinetService;

  beforeEach(() => {
    cabinetRepoStub = new InMemoryCabinetRepository();
    driverRepoStub = new InMemoryDriverRepository();
    impedanceRepoStub = new InMemoryImpedanceRepository();
    frequencyRepoStub = new InMemoryFrequencyRepository();
    getMeasurementPerCabinetService = new GetMeasurementPerCabinetService(
      cabinetRepoStub,
      driverRepoStub,
      impedanceRepoStub,
      frequencyRepoStub,
    );
  });

  it('get a measurement from 1 cabinet mounted with one driver', async () => {
    const cabinet: Cabinet = createCabinet(1, {});
    await cabinetRepoStub.save(cabinet);
    const driver: Driver = createDriver(1, {});
    await driverRepoStub.save(driver);
    const frequency: Frequency = createFrequency(1, {});
    await frequencyRepoStub.save(frequency);
    const impedance: Impedance = createImpedance(1, {});
    await impedanceRepoStub.save(impedance);

    const getMeasurementPerCabinetInput = 'cabinet-1';

    const response = await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    const expectedResponse: Measurement = {
      cabinet: createCabinet(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
      drivers: [createDriver(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date })],
      frequency: createFrequency(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
      impedance: createImpedance(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
    };
    expect(response).toEqual(expectedResponse);
  });

  it('get a measurement from 1 cabinet mounted with 2 drivers', async () => {
    const cabinet: Cabinet = createCabinet(1, {});
    await cabinetRepoStub.save(cabinet);
    const firstDriver: Driver = createDriver(1, {});
    const secondDriver: Driver = createDriver(1, {});
    for (const driver of [firstDriver, secondDriver]) {
      await driverRepoStub.save(driver);
    }
    const frequency: Frequency = createFrequency(1, {});
    await frequencyRepoStub.save(frequency);
    const impedance: Impedance = createImpedance(1, {});
    await impedanceRepoStub.save(impedance);

    const getMeasurementPerCabinetInput = 'cabinet-1';
    const response = await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    const expectedResponse: Measurement = {
      cabinet: createCabinet(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
      drivers: [
        createDriver(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
        createDriver(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
      ],
      frequency: createFrequency(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
      impedance: createImpedance(1, { createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date }),
    };
    expect(response).toEqual(expectedResponse);
  });

  it('Throws an error if the cabinet does not exists', async () => {
    const getMeasurementPerCabinetInput = 'cabinet-1';
    try {
      await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    } catch (err) {
      expect(err).toBeInstanceOf(CabinetDoesNotExist);
    }
  });

  it('Throws an error if drivers have not been found', async () => {
    const cabinet: Cabinet = createCabinet(1, {});
    await cabinetRepoStub.save(cabinet);
    const getMeasurementPerCabinetInput = 'cabinet-1';
    try {
      await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    } catch (err) {
      expect(err).toBeInstanceOf(DriversNotFound);
    }
  });

  it('Throws an error if frequency has not been found', async () => {
    const cabinet: Cabinet = createCabinet(1, {});
    await cabinetRepoStub.save(cabinet);
    const driver: Driver = createDriver(1, {});
    await driverRepoStub.save(driver);
    const getMeasurementPerCabinetInput = 'cabinet-1';
    try {
      await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    } catch (err) {
      expect(err).toBeInstanceOf(FrequencyNotFound);
    }
  });

  it('Throws an error if impedance has not been found', async () => {
    const cabinet: Cabinet = createCabinet(1, {});
    await cabinetRepoStub.save(cabinet);
    const driver: Driver = createDriver(1, {});
    await driverRepoStub.save(driver);
    const frequency: Frequency = createFrequency(1, {});
    await frequencyRepoStub.save(frequency);
    const getMeasurementPerCabinetInput = 'cabinet-1';
    try {
      await getMeasurementPerCabinetService.handler(getMeasurementPerCabinetInput);
    } catch (err) {
      expect(err).toBeInstanceOf(ImpedanceNotFound);
    }
  });
});
