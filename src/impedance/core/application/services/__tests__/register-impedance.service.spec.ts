import * as fs from 'fs';
import * as path from 'path';

import { InMemoryImpedanceRepository } from '../../../../adapters/out/persistence/impedance.repository.in-memory';
import { InMemoryCabinetRepository } from '../../../../../cabinet/adapters/out/persistence/cabinet.repository.in-memory';
import { RegisterImpedanceInput } from '../../ports/in/register-impedance.input-port';
import { RegisterImpedanceService } from '../register-impedance.service';
import { UUID_V4_REGEX } from '../../../../../shared/test/utils';
import { Impedance } from '../../../domain/impedance';
import { Cabinet } from '../../../../../cabinet/core/domain/cabinet';
import { CabinetDoesNotExist } from '../../../../../cabinet/core/domain/errors';
import { ImpedanceAlreadyExists, ImpedanceParameterNotFound } from '../../../domain/errors';
import { ImpedanceMapper } from '../../../../adapters/out/impedance.mapper';

describe('RegisterImpedanceService', () => {
  let cabinetRepoStub: InMemoryCabinetRepository;
  let impedanceRepoStub: InMemoryImpedanceRepository;
  let registerimpedanceService: RegisterImpedanceService;
  let impedanceMapper: ImpedanceMapper;

  beforeEach(() => {
    cabinetRepoStub = new InMemoryCabinetRepository();
    impedanceRepoStub = new InMemoryImpedanceRepository();
    impedanceMapper = new ImpedanceMapper();
    registerimpedanceService = new RegisterImpedanceService(impedanceRepoStub, cabinetRepoStub, impedanceMapper);
  });
  it('register an impedance', async () => {
    const measurementFile = fs.readFileSync(path.join(__dirname, './inputs/impedance_response.txt'), 'utf8');
    const existingCabinet: Cabinet = {
      uid: 'cabinet-uid',
      brandName: 'string',
      productName: 'string',
      enclosureType: 'string',
      weight: 100,
      dimension: 'string',
      manufacturingYear: 2023,
      description: 'string',
      ownerUid: 'd63d862b-d056-4488-b592-96e5ddbafe99',
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    await cabinetRepoStub.save(existingCabinet);
    const registerImpedanceInput: RegisterImpedanceInput = {
      ownerUid: 'owner-uid',
      cabinetUid: 'cabinet-uid',
      driverUid: 'driver-uid',
      measurements: measurementFile,
    };
    const response = await registerimpedanceService.handler(registerImpedanceInput);
    const expectedResponse: Impedance = {
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
      cabinetUid: 'cabinet-uid',
      impedanceCurve: [{ frequency: 1.029, impedance: 5.108, phase: 4.975 }],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('Does not register an impedance because of unexisting cabinet', async () => {
    const measurementFile = fs.readFileSync(path.join(__dirname, './inputs/impedance_response.txt'), 'utf8');
    const registerImpedanceInput: RegisterImpedanceInput = {
      ownerUid: 'owner-uid',
      cabinetUid: 'cabinet-uid',
      driverUid: 'driver-uid',
      measurements: measurementFile,
    };
    try {
      await registerimpedanceService.handler(registerImpedanceInput);
    } catch (err) {
      expect(err).toBeInstanceOf(CabinetDoesNotExist);
    }
  });

  it('Does not register a impedance because of missing TSP', async () => {
    const existingcabinet: Cabinet = {
      uid: 'cabinet-uid',
      brandName: 'string',
      productName: 'string',
      enclosureType: 'string',
      weight: 100,
      dimension: 'string',
      manufacturingYear: 2023,
      description: 'string',
      ownerUid: 'd63d862b-d056-4488-b592-96e5ddbafe99',
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    await cabinetRepoStub.save(existingcabinet);
    const wrongMeasurementFile = fs.readFileSync(
      path.join(__dirname, './inputs/impulse_response_with_missing_tsp.txt'),
      'utf8',
    );
    const registerImpedanceInput: RegisterImpedanceInput = {
      ownerUid: 'owner-uid',
      cabinetUid: 'cabinet-uid',
      driverUid: 'driver-uid',
      measurements: wrongMeasurementFile,
    };
    try {
      await registerimpedanceService.handler(registerImpedanceInput);
    } catch (err) {
      expect(err).toBeInstanceOf(ImpedanceParameterNotFound);
    }
  });

  it('Does not register a impedance because it already exists', async () => {
    const existingImpedance: Impedance = {
      uid: 'impedance-uid',
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
      cabinetUid: 'cabinet-uid',
      impedanceCurve: [{ frequency: 1.029, impedance: 5.108, phase: 4.975 }],
    };
    await impedanceRepoStub.save(existingImpedance);
    const existingcabinet: Cabinet = {
      uid: 'cabinet-uid',
      brandName: 'string',
      productName: 'string',
      enclosureType: 'string',
      weight: 100,
      dimension: 'string',
      manufacturingYear: 2023,
      description: 'string',
      ownerUid: 'd63d862b-d056-4488-b592-96e5ddbafe99',
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    await cabinetRepoStub.save(existingcabinet);
    const measurementFile = fs.readFileSync(path.join(__dirname, './inputs/impedance_response.txt'), 'utf8');
    const registerImpedanceInput: RegisterImpedanceInput = {
      ownerUid: 'owner-uid',
      cabinetUid: 'cabinet-uid',
      driverUid: 'driver-uid',
      measurements: measurementFile,
    };
    try {
      await registerimpedanceService.handler(registerImpedanceInput);
    } catch (err) {
      expect(err).toBeInstanceOf(ImpedanceAlreadyExists);
    }
  });
});
