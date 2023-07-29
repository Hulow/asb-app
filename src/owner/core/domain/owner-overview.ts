import { OwnerOverview } from './owner';
import { CabinetOverview } from '../../../cabinet/core/domain/cabinet';

export interface OwnersOverview {
  ownersLength: number;
  owners: OwnerCabinetsOverview[];
}

export interface OwnerCabinetsOverview {
  owner: OwnerOverview;
  cabinetsLength: number;
  cabinets: CabinetOverview[];
}
