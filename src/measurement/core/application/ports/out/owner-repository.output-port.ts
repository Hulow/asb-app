import { Owner } from '../../../domain/owner';

export abstract class OwnerRepositoryOutputPort {
  abstract save: (owner: Owner) => Promise<Owner>;
  abstract getByOwnername: (ownername: string) => Promise<Owner | undefined>;
  abstract getById: (ownerUid: string) => Promise<Owner | undefined>;
  abstract getAllOwners: () => Promise<Owner[] | undefined>;
}

export const OWNER_REPOSITORY_OUTPUT_PORT = Symbol.for('OwnerRepositoryOutputPort');
