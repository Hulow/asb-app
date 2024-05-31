import { injectable } from 'inversify'
import { OwnerTypeormEntity } from './owner.orm-entity'
import { OwnerRepositoryOutputPort } from '../../../../core/application/ports/out/owner-repository.output-port'
import { container } from '../../../../../di-container'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { Owner } from '../../../../core/domain/owner/owner'

@injectable()
export class SqlOwnerRepository implements OwnerRepositoryOutputPort {
  constructor(
    private readonly _repository = container
      .get(PostgresDataSource)
      .getRepository(OwnerTypeormEntity),
  ) {}

  async save(owner: Owner) {
    const entity = await this._repository.save(
      OwnerTypeormEntity.fromDomain(owner),
    )
    return entity.toDomain()
  }

  async getByOwnername(ownername: string) {
    const ownerEntity = await this._repository.findOne({ where: { ownername } })
    if (!ownerEntity) return
    return ownerEntity.toDomain()
  }

  async getById(ownerUid: string) {
    const ownerEntity = await this._repository.findOne({
      where: { uid: ownerUid },
    })
    if (!ownerEntity) return
    return ownerEntity.toDomain()
  }

  async getAllOwners() {
    const ownerEntities = await this._repository.find()
    if (!ownerEntities.length) return
    return ownerEntities.map(owner => owner.toDomain())
  }
}
