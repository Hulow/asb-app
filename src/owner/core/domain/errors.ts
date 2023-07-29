import { DomainError } from '../../../shared/domain/error';

export class OwnerAlreadyExists extends DomainError {
  constructor(ownername: string) {
    super(`Owner ${ownername} already exists`);
  }
}

export class OwnerDoesNotExist extends DomainError {
  constructor(owner: string) {
    super(`Owner ${owner} does not exist`);
  }
}

export class OwnersNotFound extends DomainError {
  constructor() {
    super(`Unable to find any owner`);
  }
}
