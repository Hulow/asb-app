import { OwnerOverview } from './owner';
import { CabinetOverview } from '../../../cabinet/core/domain/cabinet';
import { DriverOverview } from '../../../driver/core/domain/driver';

export interface OwnersCollectionOverview {
  ownersLength: number;
  owners: OwnerCollectionOverview[];
}

export interface OwnerCollectionOverview {
  owner: OwnerOverview;
  cabinets: CabinetAndDriversOverview[];
}

export interface CabinetAndDriversOverview {
  cabinet: CabinetOverview;
  drivers: DriverOverview[];
}
