import { InMemoryCabinetRepository } from '../../../adapters/out/persistence/cabinet.repository.in-memory';
import { InMemoryOwnerRepository } from '../../../../owner/adapters/out/persistence/owner.repository.in-memory';
import { InMemoryDriverRepository } from '../../../../driver/adapters/out/persistence/driver.repository.in-memory';
import { GetCabinetsPerOwnerService, CabinetsPerOwner, OwnerDescription } from './get-cabinets-per-owner.service';
import { Cabinet, CabinetOverview } from '../../domain/cabinet';
import { Owner } from '../../../../owner/core/domain/owner';
import { OwnerDoesNotExist } from '../../../../owner/core/domain/errors';
import { Driver, DriverOverview } from '../../../../driver/core/domain/driver';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { CabinetsFromOwnerNotFound } from '../../domain/errors';

function createOwner(ownerUid: number): Owner {
  return {
    uid: `owner-${ownerUid}`,
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

function createCabinet(cabinetUid: number, ownerUid: number): Cabinet {
  return {
    uid: `cabinet-${cabinetUid}`,
    brandName: 'Clauz',
    productName: 'die Maschine',
    enclosureType: 'Poccochin',
    weight: 100,
    dimension: 'dimension',
    manufacturingYear: 2023,
    description: 'description',
    ownerUid: `owner-${ownerUid}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createDriver(driverUid: number, cabinetUid: number): Driver {
  return {
    uid: `driver-${driverUid}`,
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
  };
}

function createCabinetOverview(cabinetUid: number): CabinetOverview {
  return {
    cabinetUid: `cabinet-${cabinetUid}`,
    brandName: 'Clauz',
    productName: 'die Maschine',
    enclosureType: 'Poccochin',
  };
}

function createOwnerDescription(): OwnerDescription {
  return {
    ownername: 'ownername',
    description: 'description',
  };
}

function createDriverOverview(driverUid: number): DriverOverview {
  return {
    driverUid: `driver-${driverUid}`,
    brandName: 'B&C',
    productName: '12PE32',
    driverType: 'Woofer',
  };
}

describe('GetCabinetsPerOwnerService', () => {
  let cabinetRepoStub: InMemoryCabinetRepository;
  let ownerRepoStub: InMemoryOwnerRepository;
  let driverRepoStub: InMemoryDriverRepository;
  let getCabinetsPerOwnerService: GetCabinetsPerOwnerService;

  beforeEach(() => {
    cabinetRepoStub = new InMemoryCabinetRepository();
    ownerRepoStub = new InMemoryOwnerRepository();
    driverRepoStub = new InMemoryDriverRepository();
    getCabinetsPerOwnerService = new GetCabinetsPerOwnerService(cabinetRepoStub, ownerRepoStub, driverRepoStub);
  });

  it('get an overview of one owner owning one cabinet mounted on one driver', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);

    const existingCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(existingCabinet);

    const existingDriver: Driver = createDriver(1, 1);
    await driverRepoStub.save(existingDriver);

    const response = await getCabinetsPerOwnerService.handler('ownername');
    const expectedResponse: CabinetsPerOwner = {
      owner: createOwnerDescription(),
      cabinetsLength: 1,
      cabinets: [
        {
          cabinet: createCabinetOverview(1),
          driversLength: 1,
          drivers: [createDriverOverview(1)],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('get an overview of one cabinet mounted on 2 drivers', async () => {
    const firstOwner: Owner = createOwner(1);
    await ownerRepoStub.save(firstOwner);

    const firstCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(firstCabinet);

    const firstDriver: Driver = createDriver(1, 1);
    const secondDriver: Driver = createDriver(2, 1);
    for (const existingDriver of [firstDriver, secondDriver]) {
      await driverRepoStub.save(existingDriver);
    }

    const response = await getCabinetsPerOwnerService.handler('ownername');
    const expectedResponse: CabinetsPerOwner = {
      owner: createOwnerDescription(),
      cabinetsLength: 1,
      cabinets: [
        {
          cabinet: createCabinetOverview(1),
          driversLength: 2,
          drivers: [createDriverOverview(1), createDriverOverview(2)],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('get an overview of 2 cabinets each mounted with 2 drivers', async () => {
    const firstOwner: Owner = createOwner(1);
    await ownerRepoStub.save(firstOwner);

    const firstCabinet: Cabinet = createCabinet(1, 1);
    const secondCabinet: Cabinet = createCabinet(2, 1);
    for (const existingCabinet of [firstCabinet, secondCabinet]) {
      await cabinetRepoStub.save(existingCabinet);
    }

    const firstDriver: Driver = createDriver(1, 1);
    const secondDriver: Driver = createDriver(2, 1);
    const thirdDriver: Driver = createDriver(3, 2);
    const fourthDriver: Driver = createDriver(4, 2);
    for (const existingDriver of [firstDriver, secondDriver, thirdDriver, fourthDriver]) {
      await driverRepoStub.save(existingDriver);
    }

    const response = await getCabinetsPerOwnerService.handler('ownername');
    const expectedResponse: CabinetsPerOwner = {
      owner: createOwnerDescription(),
      cabinetsLength: 2,
      cabinets: [
        {
          cabinet: createCabinetOverview(1),
          driversLength: 2,
          drivers: [createDriverOverview(1), createDriverOverview(2)],
        },
        {
          cabinet: createCabinetOverview(2),
          driversLength: 2,
          drivers: [createDriverOverview(3), createDriverOverview(4)],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('throws error if owner has not been found', async () => {
    try {
      await getCabinetsPerOwnerService.handler('ownername');
    } catch (err) {
      expect(err).toBeInstanceOf(OwnerDoesNotExist);
    }
  });

  it('throws error if cabinet does not exist', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);
    try {
      await getCabinetsPerOwnerService.handler('ownername');
    } catch (err) {
      expect(err).toBeInstanceOf(CabinetsFromOwnerNotFound);
    }
  });

  it('throws error if driver does not exist', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);

    const existingCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(existingCabinet);
    try {
      await getCabinetsPerOwnerService.handler('ownername');
    } catch (err) {
      expect(err).toBeInstanceOf(DriversNotFound);
    }
  });
});
