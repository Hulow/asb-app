import { InMemoryOwnerRepository } from '../../../adapters/out/persistence/owner.repository.in-memory';
import { InMemoryCabinetRepository } from '../../../../cabinet/adapters/out/persistence/cabinet.repository.in-memory';
import { OwnersOverview } from '../../domain/owner-overview';
import { GetOwnersOverviewService } from './get-owners-overview.service';
import { Owner, OwnerOverview } from '../../domain/owner';
import { Cabinet, CabinetOverview } from '../../../../cabinet/core/domain/cabinet';
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

describe('GetOwnersOverviewService', () => {
  let cabinetRepoStub: InMemoryCabinetRepository;
  let ownerRepoStub: InMemoryOwnerRepository;
  let getOwnersOverviewService: GetOwnersOverviewService;

  beforeEach(() => {
    cabinetRepoStub = new InMemoryCabinetRepository();
    ownerRepoStub = new InMemoryOwnerRepository();
    getOwnersOverviewService = new GetOwnersOverviewService(cabinetRepoStub, ownerRepoStub);
  });
  it('get an overview of one owner owning one cabinet mounted on one driver', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);

    const existingCabinet: Cabinet = createCabinet(1, 1);
    await cabinetRepoStub.save(existingCabinet);

    const response = await getOwnersOverviewService.handler();

    const expectedResponse: OwnersOverview = {
      ownersLength: 1,
      owners: [
        {
          owner: createOwnerOverview(1),
          cabinetsLength: 1,
          cabinets: [createCabinetOverview(1)],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });
  it('get an overview of 2 owners owning 2 cabinets', async () => {
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

    const response = await getOwnersOverviewService.handler();

    const expectedResponse: OwnersOverview = {
      ownersLength: 2,
      owners: [
        {
          owner: createOwnerOverview(1),
          cabinetsLength: 2,
          cabinets: [createCabinetOverview(1), createCabinetOverview(2)],
        },
        {
          owner: createOwnerOverview(2),
          cabinetsLength: 2,
          cabinets: [createCabinetOverview(3), createCabinetOverview(4)],
        },
      ],
    };
    expect(response).toEqual(expectedResponse);
  });

  it('throws error if owners are not found', async () => {
    try {
      await getOwnersOverviewService.handler();
    } catch (err) {
      expect(err).toBeInstanceOf(OwnersNotFound);
    }
  });

  it('throws error if cabinet does not exist', async () => {
    const existingOwner: Owner = createOwner(1);
    await ownerRepoStub.save(existingOwner);
    try {
      await getOwnersOverviewService.handler();
    } catch (err) {
      expect(err).toBeInstanceOf(CabinetsNotFound);
    }
  });
});
