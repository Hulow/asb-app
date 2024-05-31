import { injectable } from 'inversify'
import { CabinetTypeormEntity } from './cabinet.orm-entity'
import { CabinetRepositoryOutputPort } from '../../../../core/application/ports/out/cabinet-repository.output-port'
import { container } from '../../../../../di-container'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { Cabinet } from '../../../../core/domain/cabinet/cabinet'

@injectable()
export class SqlCabinetRepository implements CabinetRepositoryOutputPort {
  constructor(
    private readonly _repository = container
      .get(PostgresDataSource)
      .getRepository(CabinetTypeormEntity),
  ) {}

  async save(cabinet: Cabinet) {
    const entity = await this._repository.save(
      CabinetTypeormEntity.fromDomain(cabinet),
    )
    return entity.toDomain()
  }

  async getByProductNameAndOwnerUid(productName: string, ownerUid: string) {
    const cabinetEntity = await this._repository.findOne({
      where: {
        productName,
        ownerUid,
      },
    })
    if (!cabinetEntity) return
    return cabinetEntity.toDomain()
  }

  async getById(cabinetUid: string) {
    const cabinetEntity = await this._repository.findOne({
      where: { uid: cabinetUid },
    })
    if (!cabinetEntity) return
    return cabinetEntity.toDomain()
  }

  async getAllCabinets() {
    const cabinetEntities = await this._repository.find()
    if (!cabinetEntities.length) return
    return cabinetEntities.map(cabinet => cabinet.toDomain())
  }

  async getByOwnerUid(ownerUid: string) {
    const cabinetEntities = await this._repository.find({ where: { ownerUid } })
    if (!cabinetEntities.length) return
    return cabinetEntities.map(cabinet => cabinet.toDomain())
  }
}
