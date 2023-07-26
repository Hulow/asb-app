import { inject, injectable } from 'inversify';

import { Owner, OwnerOverview } from '../../domain/owner';
import { Driver, DriverOverview } from '../../../../driver/core/domain/driver';
import { CabinetAndDriversOverview } from '../../domain/owner-collection-overview';
import { CabinetOverview } from '../../../../cabinet/core/domain/cabinet';
import { Cabinet } from '../../../../cabinet/core/domain/cabinet';

import { OwnersNotFound } from '../../domain/errors';
import { OwnerCollectionOverview, OwnersCollectionOverview } from '../../domain/owner-collection-overview';
import { GetOwnersCollectionOverviewInputPort } from '../ports/in/get-owners-overview.input-port';
import { OwnerRepositoryOutputPort, OWNER_REPOSITORY_OUTPUT_PORT } from '../ports/out/owner-repository.output-port';

import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from '../../../../cabinet/core/application/ports/out/cabinet-repository.output-port';

import {
  DRIVER_REPOSITORY_OUTPUT_PORT,
  DriverRepositoryOutputPort,
} from '../../../../driver/core/application/ports/out/driver-repository.output-port';
import { CabinetsNotFound } from '../../../../cabinet/core/domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';

@injectable()
export class GetOwnersCollectionOverviewService implements GetOwnersCollectionOverviewInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT) private readonly _ownerRepository: OwnerRepositoryOutputPort,
    @inject(DRIVER_REPOSITORY_OUTPUT_PORT) private readonly _driverRepository: DriverRepositoryOutputPort,
  ) {}

  async handler(): Promise<OwnersCollectionOverview> {
    const response = await this.mapOwnersCollectionOverview();
    return response;
  }

  private async mapOwnersCollectionOverview(): Promise<OwnersCollectionOverview> {
    const ownersRelationshipOverview: OwnerCollectionOverview[] = [];
    const owners = await this._ownerRepository.getAllOwners();
    if (!owners) throw new OwnersNotFound();
    for (const owner of owners) {
      ownersRelationshipOverview.push(await this.mapOwnerCollectionOverview(owner));
    }
    return {
      ownersLength: owners.length,
      owners: ownersRelationshipOverview,
    };
  }

  private async mapOwnerCollectionOverview(owner: Owner): Promise<OwnerCollectionOverview> {
    const ownerOverview: OwnerOverview = this.mapOwnerOverview(owner);
    const cabinetAndDriversOverview: CabinetAndDriversOverview[] = await this.mapCabinetAndDriversOverview(owner.uid);
    return {
      owner: ownerOverview,
      cabinets: cabinetAndDriversOverview,
    };
  }

  private mapOwnerOverview(owner: Owner): OwnerOverview {
    return {
      ownerUid: owner.uid,
      ownername: owner.ownername,
    };
  }

  private async mapCabinetAndDriversOverview(ownerUid: string): Promise<CabinetAndDriversOverview[]> {
    const cabinetAndDriversOverview: CabinetAndDriversOverview[] = [];
    const cabinets = await this._cabinetRepository.getByOwnerUid(ownerUid);
    if (!cabinets) throw new CabinetsNotFound();
    for (const cabinet of cabinets) {
      const cabinetOverview: CabinetOverview = this.mapCabinetOverview(cabinet);
      const driversOverview: DriverOverview[] = await this.mapDriversOverview(cabinet.uid);
      cabinetAndDriversOverview.push({ cabinet: cabinetOverview, drivers: driversOverview });
    }
    return cabinetAndDriversOverview;
  }

  private mapCabinetOverview(cabinet: Cabinet): CabinetOverview {
    return {
      cabinetUid: cabinet.uid,
      brandName: cabinet.brandName,
      productName: cabinet.productName,
      enclosureType: cabinet.enclosureType,
    };
  }

  private async mapDriversOverview(cabinetUid: string): Promise<DriverOverview[]> {
    const driversOverview: DriverOverview[] = [];
    const drivers = await this._driverRepository.getByCabinetUid(cabinetUid);
    if (!drivers) throw new DriversNotFound();
    for (const driver of drivers) {
      const driverOverview = this.mapDriverOverview(driver);
      driversOverview.push(driverOverview);
    }
    return driversOverview;
  }

  private mapDriverOverview(driver: Driver): DriverOverview {
    return {
      driverUid: driver.uid,
      brandName: driver.brandName,
      productName: driver.productName,
      driverType: driver.driverType,
    };
  }
}
