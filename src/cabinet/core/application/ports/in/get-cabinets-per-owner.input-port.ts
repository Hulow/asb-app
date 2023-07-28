import { CabinetsPerOwner } from '../../services/get-cabinets-per-owner.service';

export const GET_CABINETS_PER_OWNER_INPUT_PORT = Symbol.for('GetCabinetsPerOwnerInputPort');

export interface GetCabinetsPerOwnerInputPort {
  handler: (ownername: string) => Promise<CabinetsPerOwner>;
}
