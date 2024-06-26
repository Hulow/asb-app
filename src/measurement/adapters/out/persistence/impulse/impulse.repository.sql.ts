import { injectable } from 'inversify'
import { ImpulseTypeormEntity } from './impulse.orm-entity'
import { ImpulseRepositoryOutputPort } from '../../../../core/application/ports/out/impulse-repository.output-port'
import { container } from '../../../../../di-container'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { Impulse } from '../../../../core/domain/impulse/impulse'

@injectable()
export class SqlImpulseRepository implements ImpulseRepositoryOutputPort {
  constructor(
    private readonly _repository = container
      .get(PostgresDataSource)
      .getRepository(ImpulseTypeormEntity),
  ) {}

  async save(impulse: Impulse) {
    const entity = await this._repository.save(
      ImpulseTypeormEntity.fromDomain(impulse),
    )
    return entity.toDomain()
  }

  async getByCabinetUid(cabinetUid: string) {
    const impulseEntity = await this._repository.findOne({
      where: { cabinetUid },
    })
    if (!impulseEntity) return
    return impulseEntity.toDomain()
  }
}
