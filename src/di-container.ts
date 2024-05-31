import { Container } from 'inversify'

import { config } from './config'
import { PostgresDataSource } from './shared/adapters/out/postgres-datasource'
import { PinoLogger } from './shared/adapters/out/pino-logger'
import {
  LoggerOutputPort,
  LOGGER_OUTPUT_PORT,
} from './shared/ports/out/logger.output-port'
import { ExpressWebServer } from './shared/adapters/in/express-web-server'
import { RegisterOwnerController } from './measurement/adapters/in/web/register-owner.controller'
import {
  REGISTER_OWNER_INPUT_PORT,
  RegisterOwnerInputPort,
} from './measurement/core/application/ports/in/register-owner.input-port'
import { RegisterOwnerCommandHandler } from './measurement/core/application/commands/owner/register-owner.command-handler'
import {
  OWNER_REPOSITORY_OUTPUT_PORT,
  OwnerRepositoryOutputPort,
} from './measurement/core/application/ports/out/owner-repository.output-port'
import { SqlOwnerRepository } from './measurement/adapters/out/persistence/owner/owner.repository.sql'
import { RegisterCabinetController } from './measurement/adapters/in/web/register-cabinet.controller'
import {
  CABINET_REPOSITORY_OUTPUT_PORT,
  CabinetRepositoryOutputPort,
} from './measurement/core/application/ports/out/cabinet-repository.output-port'
import { SqlCabinetRepository } from './measurement/adapters/out/persistence/cabinet/cabinet.repository.sql'
import {
  REGISTER_CABINET_INPUT_PORT,
  RegisterCabinetInputPort,
} from './measurement/core/application/ports/in/register-cabinet.input-port'
import { RegisterCabinetCommandHandler } from './measurement/core/application/commands/cabinet/register-cabinet.command-handler'
import {
  REGISTER_DRIVER_INPUT_PORT,
  RegisterDriverInputPort,
} from './measurement/core/application/ports/in/register-driver.input-port'
import { RegisterDriverController } from './measurement/adapters/in/web/register-driver.controller'
import {
  DRIVER_REPOSITORY_OUTPUT_PORT,
  DriverRepositoryOutputPort,
} from './measurement/core/application/ports/out/driver-repository.output-port'
import { SqlDriverRepository } from './measurement/adapters/out/persistence/driver/driver.repository.sql'
import { RegisterDriverCommandHandler } from './measurement/core/application/commands/driver/register-driver.command-handler'

export const container = new Container({
  autoBindInjectable: true,
  defaultScope: 'Singleton',
  skipBaseClassChecks: true,
})

/**
 *  input/driving/primary adapters
 */
container.bind(ExpressWebServer).toDynamicValue(() => {
  const controllers = [
    container.get(RegisterOwnerController),
    container.get(RegisterCabinetController),
    container.get(RegisterDriverController),
  ]
  return new ExpressWebServer(
    config.express,
    container.get(LOGGER_OUTPUT_PORT),
    controllers,
  )
})

/**
 *  application queries
 */

/**
 *  application commands
 */
container
  .bind<RegisterOwnerInputPort>(REGISTER_OWNER_INPUT_PORT)
  .to(RegisterOwnerCommandHandler)
container
  .bind<RegisterCabinetInputPort>(REGISTER_CABINET_INPUT_PORT)
  .to(RegisterCabinetCommandHandler)
container
  .bind<RegisterDriverInputPort>(REGISTER_DRIVER_INPUT_PORT)
  .to(RegisterDriverCommandHandler)

/**
 *  output/driven/secondary adapters
 */
container
  .bind<LoggerOutputPort>(LOGGER_OUTPUT_PORT)
  .toDynamicValue(() => new PinoLogger(config.logger))
container
  .bind(PostgresDataSource)
  .toDynamicValue(
    () =>
      new PostgresDataSource(
        config.postgres,
        container.get(LOGGER_OUTPUT_PORT),
      ),
  )
container
  .bind<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT)
  .to(SqlOwnerRepository)
container
  .bind<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT)
  .to(SqlCabinetRepository)
container
  .bind<DriverRepositoryOutputPort>(DRIVER_REPOSITORY_OUTPUT_PORT)
  .to(SqlDriverRepository)
