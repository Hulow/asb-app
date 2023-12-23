import { injectable } from 'inversify';

import { container } from '../../../../di-container';
import { PostgresDataSource } from '../../../../shared/adapters/out/postgres-datasource';
import { MeasurementRepositoryOutputPort } from '../../../core/application/ports/out/measurement-repository.output-port';
import { MeasurementQueryMapper } from '../mappers/measurement-query.mapper';
import { Measurement } from '../../../core/domain/measurement';
import { MeasurementQueryResultMapper, MeasurementOutputQuery } from '../mappers/measurement-query-result.mapper';

@injectable()
export class SqlMeasurementRepository implements MeasurementRepositoryOutputPort {
  constructor(
    private readonly _datasource = container.get(PostgresDataSource),
    private readonly _measurementQueryMapper = container.get(MeasurementQueryMapper),
  ) {}

  async getMeasurementByCabinetUid(cabinetUid: string): Promise<Measurement | undefined> {
    const selectQuery: string = this._measurementQueryMapper.generateSelectQuery();
    const driverQuery: string = this._measurementQueryMapper.generateDriverQuery();
    const groupByQuery: string = this._measurementQueryMapper.generateGroupByQuery();
    const result: MeasurementOutputQuery[] = await this._datasource.query(`
    SELECT ${selectQuery}
      string_agg('{' || ${driverQuery} '}', ', ')
    FROM asb.public.cabinet cabinet 
    JOIN asb.public.frequency frequency ON cabinet.cabinet_uid  = frequency.cabinet_uid
    JOIN asb.public.impedance impedance ON cabinet.cabinet_uid = impedance.cabinet_uid
    JOIN asb.public.driver driver ON cabinet.cabinet_uid = driver.cabinet_uid 
    WHERE cabinet.cabinet_uid  = '${cabinetUid}'
    group by 
      ${groupByQuery}
    `);

    if (!result.length) return undefined;
    return new MeasurementQueryResultMapper(result[0]).mapMeasurement();
  }
}
