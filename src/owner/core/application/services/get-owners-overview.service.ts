import { inject, injectable } from 'inversify';

import { Owner, OwnerOverview } from '../../domain/owner';
import { CabinetOverview } from '../../../../cabinet/core/domain/cabinet';
import { Cabinet } from '../../../../cabinet/core/domain/cabinet';

import { OwnersNotFound } from '../../domain/errors';
import { OwnerCabinetsOverview, OwnersOverview } from '../../domain/owner-overview';
import { GetOwnersOverviewInputPort } from '../ports/in/get-owners-overview.input-port';
import { OwnerRepositoryOutputPort, OWNER_REPOSITORY_OUTPUT_PORT } from '../ports/out/owner-repository.output-port';
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';
import { CabinetsNotFound } from '../../../../cabinet/core/domain/errors';

@injectable()
export class GetOwnersOverviewService implements GetOwnersOverviewInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT) private readonly _ownerRepository: OwnerRepositoryOutputPort,
  ) {}

  async handler(): Promise<OwnersOverview> {
    const response = await this.mapOwnersOverview();
    return response;
  }

  private async mapOwnersOverview(): Promise<OwnersOverview> {
    const ownersCabinetsOverview: OwnerCabinetsOverview[] = [];
    const owners = await this._ownerRepository.getAllOwners();
    if (!owners) throw new OwnersNotFound();
    for (const owner of owners) {
      ownersCabinetsOverview.push(await this.mapOwnerCabinetsOverview(owner));
    }
    return {
      ownersLength: owners.length,
      owners: this.sortOwnersByCreatedAt(ownersCabinetsOverview),
    };
  }

  private async mapOwnerCabinetsOverview(owner: Owner): Promise<OwnerCabinetsOverview> {
    const ownerOverview: OwnerOverview = this.mapOwnerOverview(owner);
    const cabinetsOverview: CabinetOverview[] = await this.mapCabinetsOverview(owner.uid);
    return {
      owner: ownerOverview,
      cabinetsLength: cabinetsOverview.length,
      cabinets: cabinetsOverview,
    };
  }

  private mapOwnerOverview(owner: Owner): OwnerOverview {
    return {
      ownerUid: owner.uid,
      ownername: owner.ownername,
      createdAt: owner.createdAt,
    };
  }

  private async mapCabinetsOverview(ownerUid: string): Promise<CabinetOverview[]> {
    const cabinetsOverview: CabinetOverview[] = [];
    const cabinets = await this._cabinetRepository.getByOwnerUid(ownerUid);
    if (!cabinets) throw new CabinetsNotFound();
    for (const cabinet of cabinets) {
      const cabinetOverview: CabinetOverview = this.mapCabinetOverview(cabinet);
      cabinetsOverview.push(cabinetOverview);
    }
    return this.sortCabinetsByCreatedAt(cabinetsOverview);
  }

  private mapCabinetOverview(cabinet: Cabinet): CabinetOverview {
    return {
      cabinetUid: cabinet.uid,
      brandName: cabinet.brandName,
      productName: cabinet.productName,
      enclosureType: cabinet.enclosureType,
      createdAt: cabinet.createdAt,
    };
  }

  private sortCabinetsByCreatedAt(cabinetCollectionOverview: CabinetOverview[]): CabinetOverview[] {
    return cabinetCollectionOverview.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private sortOwnersByCreatedAt(ownersOverview: OwnerCabinetsOverview[]): OwnerCabinetsOverview[] {
    return ownersOverview.sort((a, b) => b.owner.createdAt.getTime() - a.owner.createdAt.getTime());
  }
}
