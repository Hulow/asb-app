import { injectable } from 'inversify'
import { MeasurementRepositoryOutputPort } from '../../../../core/application/ports/out/measurement-repository.output-port'
import { PostgresDataSource } from '../../../../../shared/adapters/out/postgres-datasource'
import { container } from '../../../../../di-container'
import { MeasurementQueryMapper } from './measurement.query.mapper'
import { Measurement } from '../../../../core/domain/measurement/measurement'
import {
  MeasurementRepositoryMapperProps,
  MeasurementRepositoryMapper,
} from './measurement.repository.mapper'

@injectable()
export class SqlMeasurementRepository
  implements MeasurementRepositoryOutputPort
{
  constructor(
    private readonly _datasource = container.get(PostgresDataSource),
    private readonly _measurementQueryMapper = container.get(
      MeasurementQueryMapper,
    ),
  ) {}

  async getMeasurementByCabinetUid(
    cabinetUid: string,
  ): Promise<Measurement | undefined> {
    const selectQuery: string =
      this._measurementQueryMapper.generateSelectQuery()
    const driverQuery: string =
      this._measurementQueryMapper.generateDriverQuery()
    const groupByQuery: string =
      this._measurementQueryMapper.generateGroupByQuery()
    const result: MeasurementRepositoryMapperProps[] = await this._datasource
      .query(`
    SELECT ${selectQuery}
      string_agg('{' || ${driverQuery} '}', ', ')
    FROM postgres.public.cabinet cabinet 
    JOIN postgres.public.frequency frequency ON cabinet.cabinet_uid  = frequency.cabinet_uid
    JOIN postgres.public.impedance impedance ON cabinet.cabinet_uid = impedance.cabinet_uid
    JOIN postgres.public.driver driver ON cabinet.cabinet_uid = driver.cabinet_uid 
    WHERE cabinet.cabinet_uid  = '${cabinetUid}'
    group by 
      ${groupByQuery}
    `)

    if (!result.length) return undefined
    return new MeasurementRepositoryMapper(result[0]).mapMeasurement()
  }
}
