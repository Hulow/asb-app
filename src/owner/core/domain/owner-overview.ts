import { OwnerOverview } from './owner';
import { CabinetOverview } from '../../../cabinet/core/domain/cabinet';
import { DriverOverview } from '../../../driver/core/domain/driver';

export interface OwnersOverview {
  ownersLength: number;
  owners: OwnerCabinetsOverview[];
}

export interface OwnerCabinetsOverview {
  owner: OwnerOverview;
  cabinets: CabinetAndDriversOverview[];
}

export interface CabinetAndDriversOverview {
  cabinet: CabinetOverview;
  drivers: DriverOverview[];
}
