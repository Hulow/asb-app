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
import { RegisterFrequencyController } from './measurement/adapters/in/web/register-frequency.controller'
import {
  REGISTER_FREQUENCY_INPUT_PORT,
  RegisterFrequencyInputPort,
} from './measurement/core/application/ports/in/register-frequency.input-port'
import { RegisterFrequencyCommandHandler } from './measurement/core/application/commands/frequency/register-frequency.command-handler'
import {
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
  FrequencyRepositoryOutputPort,
} from './measurement/core/application/ports/out/frequency-repository.output-port'
import { SqlFrequencyRepository } from './measurement/adapters/out/persistence/frequency/frequency.repository.sql'
import { RegisterImpedanceController } from './measurement/adapters/in/web/register-impedance.controller'
import {
  REGISTER_IMPEDANCE_INPUT_PORT,
  RegisterImpedanceInputPort,
} from './measurement/core/application/ports/in/register-impedance.input-port'
import { RegisterImpedanceCommandHandler } from './measurement/core/application/commands/impedance/register-impedance.command-handler'
import {
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
  ImpedanceRepositoryOutputPort,
} from './measurement/core/application/ports/out/impedance-repository.output-port'
import { SqlImpedanceRepository } from './measurement/adapters/out/persistence/impedance/impedance.repository.sql'
import { RegisterImpulseController } from './measurement/adapters/in/web/register-impulse.controller'
import { REGISTER_IMPULSE_INPUT_PORT } from './measurement/core/application/ports/in/register-impulse.input-port'
import {
  IMPULSE_REPOSITORY_OUTPUT_PORT,
  ImpulseRepositoryOutputPort,
} from './measurement/core/application/ports/out/impulse-repository.output-port'
import { SqlImpulseRepository } from './measurement/adapters/out/persistence/impulse/impulse.repository.sql'
import { GetCabinetsController } from './measurement/adapters/in/web/get-cabinets.controller'
import {
  GET_CABINETS_INPUT_PORT,
  GetCabinetsInputPort,
} from './measurement/core/application/ports/in/get-cabinets.input-port'
import { GetCabinetQueryHandler } from './measurement/core/application/queries/cabinet/get-cabinets.query-handler'
import { GetMeasurementController } from './measurement/adapters/in/web/get-measurement.controller'
import {
  GET_MEASUREMENT_INPUT_PORT,
  GetMeasurementInputPort,
} from './measurement/core/application/ports/in/get-measurement.input-port'
import { GetMeasurementQueryHandler } from './measurement/core/application/queries/measurement/get-measurement.query-handler'
import {
  MEASUREMENT_REPOSITORY_OUTPUT_PORT,
  MeasurementRepositoryOutputPort,
} from './measurement/core/application/ports/out/measurement-repository.output-port'
import { SqlMeasurementRepository } from './measurement/adapters/out/persistence/measurement/measurement.repository.sql'

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
    container.get(RegisterFrequencyController),
    container.get(RegisterImpedanceController),
    container.get(RegisterImpulseController),
    container.get(GetCabinetsController),
    container.get(GetMeasurementController),
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

container
  .bind<GetCabinetsInputPort>(GET_CABINETS_INPUT_PORT)
  .to(GetCabinetQueryHandler)
container
  .bind<GetMeasurementInputPort>(GET_MEASUREMENT_INPUT_PORT)
  .to(GetMeasurementQueryHandler)

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
container
  .bind<RegisterFrequencyInputPort>(REGISTER_FREQUENCY_INPUT_PORT)
  .to(RegisterFrequencyCommandHandler)
container
  .bind<RegisterImpedanceInputPort>(REGISTER_IMPEDANCE_INPUT_PORT)
  .to(RegisterImpedanceCommandHandler)
container
  .bind<RegisterImpedanceInputPort>(REGISTER_IMPULSE_INPUT_PORT)
  .to(RegisterImpedanceCommandHandler)

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
container
  .bind<FrequencyRepositoryOutputPort>(FREQUENCY_REPOSITORY_OUTPUT_PORT)
  .to(SqlFrequencyRepository)
container
  .bind<ImpedanceRepositoryOutputPort>(IMPEDANCE_REPOSITORY_OUTPUT_PORT)
  .to(SqlImpedanceRepository)
container
  .bind<ImpulseRepositoryOutputPort>(IMPULSE_REPOSITORY_OUTPUT_PORT)
  .to(SqlImpulseRepository)
container
  .bind<MeasurementRepositoryOutputPort>(MEASUREMENT_REPOSITORY_OUTPUT_PORT)
  .to(SqlMeasurementRepository)
