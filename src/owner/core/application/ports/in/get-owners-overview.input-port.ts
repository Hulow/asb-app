import { OwnersOverview } from '../../../domain/owner-overview';

export const GET_OWNERS_OVERVIEW_INPUT_PORT = Symbol.for('GetOwnersOverviewInputPort');

export interface GetOwnersOverviewInputPort {
  handler: () => Promise<OwnersOverview>;
}
