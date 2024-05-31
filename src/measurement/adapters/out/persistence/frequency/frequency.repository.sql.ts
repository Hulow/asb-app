import { injectable } from 'inversify'
import { FrequencyTypeormEntity } from './frequency.orm-entity'
import { FrequencyRepositoryOutputPort } from '../../../../core/application/ports/out/frequency-repository.output-port'
import { container } from '../../../../../di-container'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { Frequency } from '../../../../core/domain/frequency/frequency'

@injectable()
export class SqlFrequencyRepository implements FrequencyRepositoryOutputPort {
  constructor(
    private readonly _repository = container
      .get(PostgresDataSource)
      .getRepository(FrequencyTypeormEntity),
  ) {}

  async save(frequency: Frequency) {
    await this._repository.save(FrequencyTypeormEntity.fromDomain(frequency))
    return
  }

  async getByCabinetUid(cabinetUid: string) {
    const frequencyEntity = await this._repository.findOne({
      where: { cabinetUid },
    })
    if (!frequencyEntity) return
    return frequencyEntity.toDomain()
  }
}
