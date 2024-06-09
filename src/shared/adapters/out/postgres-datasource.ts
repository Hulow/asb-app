import { DataSource } from 'typeorm'

import { LoggerOutputPort } from '../../ports/out/logger.output-port'
import { OwnerTypeormEntity } from '../../../measurement/adapters/out/persistence/owner/owner.orm-entity'
import { CabinetTypeormEntity } from '../../../measurement/adapters/out/persistence/cabinet/cabinet.orm-entity'
import { DriverTypeormEntity } from '../../../measurement/adapters/out/persistence/driver/driver.orm-entity'
import { FrequencyTypeormEntity } from '../../../measurement/adapters/out/persistence/frequency/frequency.orm-entity'
import { ImpedanceTypeormEntity } from '../../../measurement/adapters/out/persistence/impedance/impedance.orm-entity'
import { ImpulseTypeormEntity } from '../../../measurement/adapters/out/persistence/impulse/impulse.orm-entity'

export interface PostgresConfig {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly database: string
}

export class PostgresDataSource extends DataSource {
  constructor(
    config: PostgresConfig,
    private readonly _logger: LoggerOutputPort,
  ) {
    super({
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [
        OwnerTypeormEntity,
        CabinetTypeormEntity,
        DriverTypeormEntity,
        FrequencyTypeormEntity,
        ImpedanceTypeormEntity,
        ImpulseTypeormEntity,
      ],
    })
  }

  async start() {
    await this.initialize()
    this._logger.info('Postgres database connection established')
  }

  async stop() {
    await this.destroy()
    this._logger.info('Postgres database connection closed')
  }
}
