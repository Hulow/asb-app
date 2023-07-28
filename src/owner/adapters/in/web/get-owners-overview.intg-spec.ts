import request from 'supertest';

import { config } from '../../../../config';
import { container } from '../../../../di-container';
import { ExpressWebServer } from '../../../../shared/adapters/in/express-web-server';
import { PostgresDataSource } from '../../../../shared/adapters/out/postgres-datasource';
import {
  OwnerRepositoryOutputPort,
  OWNER_REPOSITORY_OUTPUT_PORT,
} from '../../../core/application/ports/out/owner-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';

const expressApp = container.get(ExpressWebServer).app;
const database = container.get(PostgresDataSource);
const cabinetRepository = container.get<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT);
const ownerRepository = container.get<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT);

describe(`/api/owners-overview`, () => {
  beforeAll(async () => {
    await database.start();
  });

  afterEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.stop();
  });

  it(`get all owners`, async () => {
    const existingOwner = {
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
    await ownerRepository.save(existingOwner);

    const existingCabinet = {
      uid: `4343b2ab-a22e-4d12-ac13-6bb399d4e513`,
      brandName: 'Clauz',
      productName: 'die Maschine',
      enclosureType: 'Poccochin',
      weight: 100,
      dimension: 'dimension',
      manufacturingYear: 2023,
      description: 'description',
      ownerUid: `4343b2ab-a22e-4d12-ac13-6bb399d4e512`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await cabinetRepository.save(existingCabinet);

    await request(expressApp)
      .get('/api/owners-overview')
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .expect(200);
  });
  it(`throw an error`, async () => {
    await request(expressApp)
      .get('/api/owners-overview')
      .set({ Authorization: config.express.asbKeyUrl, Accept: 'application/json' })
      .expect(500);
  });
});
