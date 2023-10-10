/* eslint-disable */

import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

import { container } from '../../src/di-container';
import { LoggerOutputPort, LOGGER_OUTPUT_PORT } from '../../src/shared/ports/out/logger.output-port';
import { PostgresDataSource } from '../../src/shared/adapters/out/postgres-datasource';
import {
  OwnerRepositoryOutputPort,
  OWNER_REPOSITORY_OUTPUT_PORT,
} from '../../src/owner/core/application/ports/out/owner-repository.output-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../../src/cabinet/core/application/ports/out/cabinet-repository.output-port';
import {
  DriverRepositoryOutputPort,
  DRIVER_REPOSITORY_OUTPUT_PORT,
} from '../../src/driver/core/application/ports/out/driver-repository.output-port';
import {
  FrequencyRepositoryOutputPort,
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
} from '../../src/frequency/core/application/ports/out/frequency-repository.output-port';

import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from '../../src/impedance/core/application/ports/out/impedance-repository.output-port';

import { Owner } from '../../src/owner/core/domain/owner';
import { Driver } from '../../src/driver/core/domain/driver';
import { Cabinet } from '../../src/cabinet/core/domain/cabinet';
import { Frequency, FrequencyResponse } from '../../src/frequency/core/domain/frequency';
import { Impedance, ImpedanceMeasurement } from '../../src/impedance/core/domain/impedance';

const database = container.get(PostgresDataSource);
const logger = container.get<LoggerOutputPort>(LOGGER_OUTPUT_PORT);
const ownerRepository = container.get<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT);
const driverRepository = container.get<DriverRepositoryOutputPort>(DRIVER_REPOSITORY_OUTPUT_PORT);
const cabinetRepository = container.get<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT);
const frequencyRepository = container.get<FrequencyRepositoryOutputPort>(FREQUENCY_REPOSITORY_OUTPUT_PORT);
const impedanceRepository = container.get<ImpedanceRepositoryOutputPort>(IMPEDANCE_REPOSITORY_OUTPUT_PORT);

async function seedDatabase() {
  await database.start();
  process.env.NODE_ENV = 'test';
  await database.clear();
  process.env.NODE_ENV = 'development';
  let OWNER_COUNTER = 2;
  while (OWNER_COUNTER !== 0) {
    const ownerUid = faker.string.uuid();
    const newOwner = generateOwner(ownerUid);
    await ownerRepository.save(newOwner);
    logger.info(`Owner ${OWNER_COUNTER} has been stored into Db`);
    let CABINETS_PER_OWNER_COUNTER = 3;
    while (CABINETS_PER_OWNER_COUNTER !== 0) {
      const cabinetUid = faker.string.uuid();
      const newCabinet = generateCabinet(cabinetUid, ownerUid);
      await cabinetRepository.save(newCabinet);
      logger.info(`Cabinet ${CABINETS_PER_OWNER_COUNTER} has been stored into Db`);

      const newImpedance = generateImpedance(cabinetUid);
      await impedanceRepository.save(newImpedance);
      logger.info(`Impedance ${CABINETS_PER_OWNER_COUNTER} has been stored into Db`);

      const newFrequency = generateFrequency(cabinetUid);
      await frequencyRepository.save(newFrequency);
      logger.info(`Frequency ${CABINETS_PER_OWNER_COUNTER} has been stored into Db`);

      CABINETS_PER_OWNER_COUNTER--;
      let DRIVERS_PER_CABINET = 2;
      while (DRIVERS_PER_CABINET !== 0) {
        const driverUid = faker.string.uuid();
        const newDriver = generateDriver(driverUid, cabinetUid);
        await driverRepository.save(newDriver);
        logger.info(`Driver ${DRIVERS_PER_CABINET} has been stored into Db`);
        DRIVERS_PER_CABINET--;
      }
    }
    OWNER_COUNTER--;
  }
  logger.info('data have been injected to Db');
  await database.stop();
}
seedDatabase().catch((err) => console.log(err));

function generateOwner(uid: string): Owner {
  return {
    uid: uid,
    firstName: faker.person.firstName('female' || 'male'),
    lastName: faker.person.lastName('female' || 'male'),
    ownername: faker.internet.userName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    city: faker.location.city(),
    description: faker.commerce.productDescription(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateCabinet(uid: string, ownerUid: string): Cabinet {
  return {
    uid: uid,
    brandName: faker.vehicle.manufacturer(),
    productName: faker.commerce.productName(),
    enclosureType: faker.vehicle.model(),
    weight: faker.number.int(100),
    dimension: `${faker.number.int(100)}L`,
    manufacturingYear: 2023,
    description: faker.commerce.productDescription(),
    ownerUid: ownerUid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateDriver(uid: string, cabinetUid: string): Driver {
  return {
    uid: uid,
    brandName: faker.vehicle.manufacturer(),
    productName: faker.commerce.productName(),
    driverType: faker.vehicle.model(),
    manufacturingYear: 2000,
    nominalDiameter: 12,
    nominalImpedance: 8,
    continuousPowerHandling: 500,
    cabinetUid: cabinetUid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateImpedance(cabinetUid: string): Impedance {
  const measurements: ImpedanceMeasurement[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/impedance.json')).toString('utf-8'),
  );
  return {
    uid: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
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
    cabinetUid: cabinetUid,
    impedanceCurve: measurements,
  };
}

function generateFrequency(cabinetUid: string): Frequency {
  const measurements: FrequencyResponse[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/frequency.json')).toString('utf-8'),
  );
  return {
    uid: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    measuredBy: 'REW V5.20.13',
    source: 'Scarlett 2i2 USB',
    sweepLength: '512k Log Swept Sine',
    measuredAt: 'Mar 22, 2023 2:53:43 PM',
    frequencyWeightings: 'C-weighting',
    targetLevel: '75.0 dB',
    note: 'second measurement Mic is at 1m and almost align with tweeter',
    smoothing: '1/3 octave',
    measurements: measurements,
    cabinetUid: cabinetUid,
  };
}
