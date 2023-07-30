import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

import { config } from '../../../../config';
import { container } from '../../../../di-container';
import { ExpressWebServer } from '../../../../shared/adapters/in/express-web-server';
import { PostgresDataSource } from '../../../../shared/adapters/out/postgres-datasource';
import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from '../../../core/application/ports/out/impedance-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import {
  OwnerRepositoryOutputPort,
  OWNER_REPOSITORY_OUTPUT_PORT,
} from '../../../../owner/core/application/ports/out/owner-repository.output-port';
import { UUID_V4_REGEX } from '../../../../shared/test/utils';

const expressApp = container.get(ExpressWebServer).app;
const database = container.get(PostgresDataSource);
const frequencyRepository = container.get<ImpedanceRepositoryOutputPort>(IMPEDANCE_REPOSITORY_OUTPUT_PORT);
const cabinetRepository = container.get<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT);
const ownerRepository = container.get<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT);

describe(`/api/impedance/register`, () => {
  beforeAll(async () => {
    await database.start();
  });

  afterEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.stop();
  });

  it(`register an impedance`, async () => {
    const ownerInput = {
      uid: '4343b2ab-a22e-4d12-ac13-6bb399d4e512',
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
    const existingOwner = await ownerRepository.save(ownerInput);
    const cabinetInput = {
      uid: '4343b2ab-a22e-4d12-ac13-6bb399d4e513',
      brandName: 'Clauz',
      productName: 'die Maschine',
      enclosureType: 'Poccochin',
      weight: 100,
      dimension: 'dimension',
      manufacturingYear: 2023,
      description: 'description',
      ownerUid: '4343b2ab-a22e-4d12-ac13-6bb399d4e512',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const existingCabinet = await cabinetRepository.save(cabinetInput);
    const measurementFile = fs.readFileSync(
      path.join(__dirname, '../../../core/application/services/__tests__/inputs/impedance_response.txt'),
      'utf8',
    );
    const registerImpedanceInput = {
      ownerUid: existingOwner.uid,
      cabinetUid: existingCabinet.uid,
      driverUid: 'driver-uid',
      measurements: measurementFile,
    };
    const expectedResponse = {
      uid: expect.stringMatching(UUID_V4_REGEX) as string,
      createdAt: expect.any(Date) as Date,
      updatedAt: expect.any(Date) as Date,
      source: 'DATS',
      pistonDiameter: '393',
      resonanceFrequency: '40.17',
      dcResistance: '5.107',
      acResistance: '151.4',
      mechanicalDamping: '13.14',
      electricalDamping: '0.4587',
      totalDamping: '0.4432',
      equivalenceCompliance: '173',
      voiceCoilInductance: '1.473',
      efficiency: '2.331',
      sensitivity: '95.78',
      coneMass: '187.5',
      suspensionCompliance: '0.084',
      forceFactor: '22.95',
      kR: '0.05354',
      xR: '0.5762',
      kI: '0.04204',
      xI: '0.6239',
      cabinetUid: cabinetInput.uid,
      impedanceCurve: [{ frequency: 1.029, impedance: 5.108, phase: 4.975 }],
    };
    const response: { body: { cabinetUid: string } } = await request(expressApp)
      .post('/api/impedance/register')
      .send(registerImpedanceInput)
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .expect(200);
    expect(await frequencyRepository.getByCabinetUid(response.body.cabinetUid)).toEqual(expectedResponse);
  });

  it(`Does not register an impedance`, async () => {
    const registerFrequencyInput = {
      ownerUid: 'uid',
      cabinetUid: '4343b2ab-a22e-4d12-ac13-6bb399d4e512',
      driverUid: 'uid',
      measurements: 'measurementFile',
    };
    await request(expressApp)
      .post('/api/impedance/register')
      .send(registerFrequencyInput)
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .expect(500);
  });
});
