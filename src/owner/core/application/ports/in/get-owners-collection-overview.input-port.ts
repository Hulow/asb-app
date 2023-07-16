import { OwnersCollectionOverview } from '../../../domain/owner-collection-overview';

export const GET_OWNERS_COLLECTION_OVERVIEW_INPUT_PORT = Symbol.for('GetOwnersCollectionOverviewInputPort');

export interface GetOwnersCollectionOverviewInputPort {
  handler: () => Promise<OwnersCollectionOverview>;
}
