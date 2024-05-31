import { DataSource } from 'typeorm'

import { LoggerOutputPort } from '../../ports/out/logger.output-port'
import { OwnerTypeormEntity } from '../../../measurement/adapters/out/persistence/owner/owner.orm-entity'
import { CabinetTypeormEntity } from '../../../measurement/adapters/out/persistence/cabinet/cabinet.orm-entity'
import { DriverTypeormEntity } from '../../../measurement/adapters/out/persistence/driver/driver.orm-entity'

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
      entities: [OwnerTypeormEntity, CabinetTypeormEntity, DriverTypeormEntity],
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

  async clear() {
    if (process.env.NODE_ENV !== 'test') {
      return this._logger.info('Unable to truncate database tables')
    }
    for (const entity of this.entityMetadatas) {
      const repository = this.getRepository(entity.name)
      await repository.query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
      )
      this._logger.info(`Table ${entity.tableName} has been truncated`)
    }
  }
}
