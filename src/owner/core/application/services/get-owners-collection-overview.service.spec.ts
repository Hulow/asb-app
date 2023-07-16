import { InMemoryOwnerRepository } from '../../../adapters/out/persistence/owner.repository.in-memory';
import { InMemoryCabinetRepository } from '../../../../cabinet/adapters/out/persistence/cabinet.repository.in-memory';
import { InMemoryDriverRepository } from '../../../../driver/adapters/out/persistence/driver.repository.in-memory';
import { OwnersCollectionOverview } from '../../domain/owner-collection-overview';
import { GetOwnersCollectionOverviewService } from './get-owners-collection-overview.service';
import { Owner, OwnerOverview } from '../../domain/owner';
import { Cabinet, CabinetOverview } from '../../../../cabinet/core/domain/cabinet';
import { Driver, DriverOverview } from '../../../../driver/core/domain/driver';
import { DriversNotFound } from '../../../../driver/core/domain/errors';
import { OwnersNotFound } from '../../domain/errors';
import { CabinetsNotFound } from '../../../../cabinet/core/domain/errors';

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

function createOwnerOverview(ownerUid: number): OwnerOverview {
  return {
    ownerUid: `owner-${ownerUid}`,
    ownername: 'ownername',
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

describe('GetOwnersCollectionOverviewService', () => {
  let cabinetRepoStub: InMemoryCabinetRepository;
  let ownerRepoStub: InMemoryOwnerRepository;
  let driverRepoStub: InMemoryDriverRepository;
  let getOwnersCollectionOverviewService: GetOwnersCollectionOverviewService;

  beforeEach(() => {
    cabinetRepoStub = new InMemoryCabinetRepository();
    ownerRepoStub = new InMemoryOwnerRepository();
    driverRepoStub = new InMemoryDriverRepository();
    getOwnersCollectionOverviewService = new GetOwnersCollectionOverviewService(
      cabinetRepoStub,
      ownerRepoStub,
      driverRepoStub,
    );
  });
  it('get an overview of one owner owning one cabinet mounted on one driver', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);

    const existingCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(existingCabinet);

    const existingDriver: Driver = createDriver(1, 1);
    await driverRepoStub.save(existingDriver);

    const response = await getOwnersCollectionOverviewService.handler();

    const expectedResponse: OwnersCollectionOverview = {
      ownersLength: 1,
      owners: [
        {
          owner: createOwnerOverview(1),
          cabinets: [
            {
              cabinet: createCabinetOverview(1),
              drivers: [createDriverOverview(1)],
            },
          ],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });
  it('get an overview of 2 owners owning 2 cabinets mounted by 2 drivers each', async () => {
    const firstOwner: Owner = createOwner(1);
    const secondOwner: Owner = createOwner(2);
    for (const owner of [firstOwner, secondOwner]) {
      await ownerRepoStub.save(owner);
    }

    const firstCabinet: Cabinet = createCabinet(1, 1);
    const secondCabinet: Cabinet = createCabinet(2, 1);
    const thirdCabinet: Cabinet = createCabinet(3, 2);
    const fourthCabinet: Cabinet = createCabinet(4, 2);
    const cabinets = [firstCabinet, secondCabinet, thirdCabinet, fourthCabinet];
    for (const cabinet of cabinets) {
      await cabinetRepoStub.save(cabinet);
    }

    const firstDriver: Driver = createDriver(1, 1);
    const secondDriver: Driver = createDriver(2, 1);
    const thirdDriver: Driver = createDriver(3, 2);
    const fourthDriver: Driver = createDriver(4, 2);
    const fifhtDriver: Driver = createDriver(5, 3);
    const sixthDriver: Driver = createDriver(6, 3);
    const seventhDriver: Driver = createDriver(7, 4);
    const eighthDriver: Driver = createDriver(8, 4);
    for (const existingDriver of [
      firstDriver,
      secondDriver,
      thirdDriver,
      fourthDriver,
      fifhtDriver,
      sixthDriver,
      seventhDriver,
      eighthDriver,
    ]) {
      await driverRepoStub.save(existingDriver);
    }

    const response = await getOwnersCollectionOverviewService.handler();

    const expectedResponse: OwnersCollectionOverview = {
      ownersLength: 2,
      owners: [
        {
          owner: createOwnerOverview(1),
          cabinets: [
            {
              cabinet: createCabinetOverview(1),
              drivers: [createDriverOverview(1), createDriverOverview(2)],
            },
            {
              cabinet: createCabinetOverview(2),
              drivers: [createDriverOverview(3), createDriverOverview(4)],
            },
          ],
        },
        {
          owner: createOwnerOverview(2),
          cabinets: [
            {
              cabinet: createCabinetOverview(3),
              drivers: [createDriverOverview(5), createDriverOverview(6)],
            },
            {
              cabinet: createCabinetOverview(4),
              drivers: [createDriverOverview(7), createDriverOverview(8)],
            },
          ],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('throws error if owners are not found', async () => {
    try {
      await getOwnersCollectionOverviewService.handler();
    } catch (err) {
      expect(err).toBeInstanceOf(OwnersNotFound);
    }
  });

  it('throws error if cabinet does not exist', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);
    try {
      await getOwnersCollectionOverviewService.handler();
    } catch (err) {
      expect(err).toBeInstanceOf(CabinetsNotFound);
    }
  });

  it('throws error if driver does not exist', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);

    const existingCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(existingCabinet);
    try {
      await getOwnersCollectionOverviewService.handler();
    } catch (err) {
      expect(err).toBeInstanceOf(DriversNotFound);
    }
  });
});
