import { CabinetOverview } from './cabinet';
import { DriverOverview } from '../../../driver/core/domain/driver';
import { OwnerOverview } from '../../../owner/core/domain/owner';

export interface CabinetsCollectionOverview {
  cabinetsLength: number;
  cabinets: CabinetCollectionOverview[];
}

export interface CabinetCollectionOverview {
  cabinet: CabinetOverview;
  owner: OwnerOverview;
  drivers: DriverOverview[];
}
