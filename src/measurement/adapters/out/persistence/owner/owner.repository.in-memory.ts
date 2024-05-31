/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify'
import { OwnerRepositoryOutputPort } from '../../../../core/application/ports/out/owner-repository.output-port'
import { Owner } from '../../../../core/domain/owner/owner'

@injectable()
export class InMemoryOwnerRepository implements OwnerRepositoryOutputPort {
  public owners: Owner[] = []
  public storedOwners: Owner[] = []

  clean(): void {
    this.owners = []
    this.storedOwners = []
  }

  add(owner: Owner): this {
    this.owners.push(owner)
    return this
  }

  toHaveBeenCalledWith(): Owner[] {
    return this.storedOwners
  }

  save(owner: Owner): Promise<Owner> {
    this.storedOwners.push(owner)
    return Promise.resolve(this.owners[0])
  }

  getByOwnername(ownername: string): Promise<Owner | undefined> {
    return Promise.resolve(this.owners[0])
  }

  getById(ownerUid: string): Promise<Owner | undefined> {
    return Promise.resolve(this.owners[0])
  }

  async getAllOwners(): Promise<Owner[] | undefined> {
    if (this.owners.length === 0) return Promise.resolve(undefined)
    return Promise.resolve(this.owners)
  }
}
