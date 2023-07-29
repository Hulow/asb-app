import { inject, injectable } from 'inversify';

import { Cabinet, CabinetOverview } from '../../domain/cabinet';
import { Driver, DriverOverview } from '../../../../driver/core/domain/driver';
import { Owner } from '../../../../owner/core/domain/owner';
import { OwnerDoesNotExist } from '../../../../owner/core/domain/errors';
import { GetCabinetsPerOwnerInputPort } from '../ports/in/get-cabinets-per-owner.input-port';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from '../ports/out/cabinet-repository.output-port';
import {
  OWNER_REPOSITORY_OUTPUT_PORT,
  OwnerRepositoryOutputPort,
} from '../../../../owner/core/application/ports/out/owner-repository.output-port';
import {
  DRIVER_REPOSITORY_OUTPUT_PORT,
  DriverRepositoryOutputPort,
} from '../../../../driver/core/application/ports/out/driver-repository.output-port';
import { CabinetsFromOwnerNotFound } from '../../domain/errors';
import { DriversNotFound } from '../../../../driver/core/domain/errors';

export interface CabinetsPerOwner {
  owner: OwnerDescription;
  cabinetsLength: number;
  cabinets: CabinetCollectionOverview[];
}

export interface OwnerDescription {
  ownername: string;
  description: string;
}

export interface CabinetCollectionOverview {
  cabinet: CabinetOverview;
  driversLength: number;
  drivers: DriverOverview[];
}

@injectable()
export class GetCabinetsPerOwnerService implements GetCabinetsPerOwnerInputPort {
  constructor(
    @inject(CABINET_REPOSITORY_OUTPUT_PORT) private readonly _cabinetRepository: CabinetRepositoryOutputPort,
    @inject(OWNER_REPOSITORY_OUTPUT_PORT) private readonly _ownerRepository: OwnerRepositoryOutputPort,
    @inject(DRIVER_REPOSITORY_OUTPUT_PORT) private readonly _driverRepository: DriverRepositoryOutputPort,
  ) {}

  async handler(ownername: string): Promise<CabinetsPerOwner> {
    const owner = await this._ownerRepository.getByOwnername(ownername);
    if (!owner) throw new OwnerDoesNotExist(ownername);
    const ownerDescription = this.mapOwnerDescription(owner);
    const cabinetsCollectionOverview = await this.mapCabinetsCollectionOverview(owner.uid);
    return this.mapCabinetsPerOwner(ownerDescription, cabinetsCollectionOverview);
  }

  private mapOwnerDescription(owner: Owner): OwnerDescription {
    return {
      ownername: owner.ownername,
      description: owner.description,
    };
  }

  private async mapCabinetsCollectionOverview(ownerUid: string): Promise<CabinetCollectionOverview[]> {
    const cabinetsCollectionOverview: CabinetCollectionOverview[] = [];
    const cabinets = await this._cabinetRepository.getByOwnerUid(ownerUid);
    if (!cabinets) throw new CabinetsFromOwnerNotFound(ownerUid);
    for (const cabinet of cabinets) {
      const cabinetCollectionOverview = await this.mapCabinetCollectionOverview(cabinet);
      cabinetsCollectionOverview.push(cabinetCollectionOverview);
    }
    return cabinetsCollectionOverview;
  }

  private async mapCabinetCollectionOverview(cabinet: Cabinet): Promise<CabinetCollectionOverview> {
    const cabinetOverview: CabinetOverview = this.mapCabinetOverview(cabinet);
    const driversOverview: DriverOverview[] = await this.mapDriversOverview(cabinet.uid);
    return {
      cabinet: cabinetOverview,
      driversLength: driversOverview.length,
      drivers: driversOverview,
    };
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
    const drivers: DriverOverview[] = [];
    const existingDrivers = await this._driverRepository.getByCabinetUid(cabinetUid);
    if (!existingDrivers) {
      throw new DriversNotFound();
    }
    for (const existingDriver of existingDrivers) {
      const driverOverview = this.mapDriverOverview(existingDriver);
      drivers.push(driverOverview);
    }
    return drivers;
  }

  private mapDriverOverview(driver: Driver): DriverOverview {
    return {
      driverUid: driver.uid,
      driverType: driver.driverType,
      productName: driver.productName,
      brandName: driver.brandName,
    };
  }

  private mapCabinetsPerOwner(
    ownerDescription: OwnerDescription,
    cabinetsCollectionOverview: CabinetCollectionOverview[],
  ): CabinetsPerOwner {
    return {
      owner: ownerDescription,
      cabinetsLength: cabinetsCollectionOverview.length,
      cabinets: cabinetsCollectionOverview,
    };
  }
}
