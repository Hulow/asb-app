import request from 'supertest';

import { config } from '../../../../config';
import { container } from '../../../../di-container';
import { ExpressWebServer } from '../../../../shared/adapters/in/express-web-server';
import { PostgresDataSource } from '../../../../shared/adapters/out/postgres-datasource';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import {
  DriverRepositoryOutputPort,
  DRIVER_REPOSITORY_OUTPUT_PORT,
} from '../../../../driver/core/application/ports/out/driver-repository.output-port';
import {
  OwnerRepositoryOutputPort,
  OWNER_REPOSITORY_OUTPUT_PORT,
} from '../../../../owner/core/application/ports/out/owner-repository.output-port';
import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from '../../../../impedance/core/application/ports/out/impedance-repository.output-port';
import {
  FrequencyRepositoryOutputPort,
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
} from '../../../../frequency/core/application/ports/out/frequency-repository.output-port';

function createOwner(ownerUid: string) {
  return {
    uid: ownerUid,
    firstName: 'firstName',
    lastName: 'lastName',
    ownername: 'ownername',
    email: 'email',
    phoneNumber: 'phoneNumber',
    city: 'city',
    description: 'description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createCabinet(cabinetUid: string, ownerUid: string) {
  return {
    uid: cabinetUid,
    brandName: 'Clauz',
    productName: 'die Maschine',
    enclosureType: 'Poccochin',
    weight: 100,
    dimension: 'dimension',
    manufacturingYear: 2023,
    description: 'description',
    ownerUid: ownerUid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createDriver(driverUid: string, cabinetUid: string) {
  return {
    uid: driverUid,
    brandName: 'B&C',
    productName: '12PE32',
    driverType: 'Woofer',
    manufacturingYear: 2015,
    nominalDiameter: 12,
    nominalImpedance: 8,
    continuousPowerHandling: 500,
    cabinetUid: cabinetUid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createFrequency(frequencyUid: string, cabinetUid: string, payload: object) {
  return {
    uid: frequencyUid,
    measuredBy: 'string',
    source: 'string',
    sweepLength: 'string',
    measuredAt: 'string',
    frequencyWeightings: 'string',
    targetLevel: 'string',
    note: 'string',
    smoothing: 'string',
    measurements: [{ phase: 1, spl: 1, frequency: 1 }],
    cabinetUid: cabinetUid,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
}

function createImpedance(impedanceUid: string, cabinetUid: string) {
  return {
    uid: impedanceUid,
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
    cabinetUid: cabinetUid,
    impedanceCurve: [{ phase: 1, impedance: 1, frequency: 1 }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const expressApp = container.get(ExpressWebServer).app;
const database = container.get(PostgresDataSource);
const cabinetRepository = container.get<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT);
const driverRepository = container.get<DriverRepositoryOutputPort>(DRIVER_REPOSITORY_OUTPUT_PORT);
const ownerRepository = container.get<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT);
const impedanceRepository = container.get<ImpedanceRepositoryOutputPort>(IMPEDANCE_REPOSITORY_OUTPUT_PORT);
const frequencyeRepository = container.get<FrequencyRepositoryOutputPort>(FREQUENCY_REPOSITORY_OUTPUT_PORT);

describe(`/api/measurement/measurement-per-cabinet`, () => {
  beforeAll(async () => {
    await database.start();
  });

  afterEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.stop();
  });

  it(`get a measurement`, async () => {
    const existingOwner = createOwner('4343b2ab-a22e-4d12-ac13-6bb399d4e512');
    await ownerRepository.save(existingOwner);
    const existingCabinet = createCabinet(
      '4343b2ab-a22e-4d12-ac13-6bb399d4e513',
      '4343b2ab-a22e-4d12-ac13-6bb399d4e512',
    );
    await cabinetRepository.save(existingCabinet);
    const existingFrequency = createFrequency(
      '4343b2ab-a22e-4d12-ac13-6bb399d4e514',
      '4343b2ab-a22e-4d12-ac13-6bb399d4e513',
      {},
    );
    await frequencyeRepository.save(existingFrequency);
    const existingImpedance = createImpedance(
      '4343b2ab-a22e-4d12-ac13-6bb399d4e515',
      '4343b2ab-a22e-4d12-ac13-6bb399d4e513',
    );
    await impedanceRepository.save(existingImpedance);
    const existingDriver = createDriver('4343b2ab-a22e-4d12-ac13-6bb399d4e516', '4343b2ab-a22e-4d12-ac13-6bb399d4e513');
    await driverRepository.save(existingDriver);

    const cabinetInput = {
      ...existingCabinet,
      ...{ createdAt: expect.any(Date) as Date, updatedAt: expect.any(Date) as Date },
    };

    const res: { body: { userUid: string } } = await request(expressApp)
      .get('/api/measurement/measurement-per-cabinet')
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .send({ cabinetUid: '4343b2ab-a22e-4d12-ac13-6bb399d4e513' })
      .expect(200);
    expect(await cabinetRepository.getById(res.body.userUid)).toMatchObject(cabinetInput);
  });

  it(`it rejects 500 response if missing Cabinet`, async () => {
    const existingOwner = createOwner('4343b2ab-a22e-4d12-ac13-6bb399d4e512');
    await ownerRepository.save(existingOwner);

    await request(expressApp)
      .get('/api/measurement/measurement-per-cabinet')
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .send({ cabinetUid: '4343b2ab-a22e-4d12-ac13-6bb399d4e513' })
      .expect(500);
  });
});
