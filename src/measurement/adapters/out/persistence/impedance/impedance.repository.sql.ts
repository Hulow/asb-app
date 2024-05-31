import { injectable } from 'inversify';
import { ImpedanceTypeormEntity } from './impedance.orm-entity';
import { ImpedanceRepositoryOutputPort } from '../../../../core/application/ports/out/impedance-repository.output-port';
import { container } from '../../../../../di-container';
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource';
import { Impedance } from '../../../../core/domain/impedance/impedance';

@injectable()
export class SqlImpedanceRepository implements ImpedanceRepositoryOutputPort {
  constructor(private readonly _repository = container.get(PostgresDataSource).getRepository(ImpedanceTypeormEntity)) {}

  async save(impedance: Impedance) {
    const entity = await this._repository.save(ImpedanceTypeormEntity.fromDomain(impedance));
    return entity.toDomain();
  }

   async getByCabinetUid(cabinetUid: string) {
    const impedanceEntity = await this._repository.findOne({ where: { cabinetUid } });
    if (!impedanceEntity) return;
    return impedanceEntity.toDomain();
  }
}
