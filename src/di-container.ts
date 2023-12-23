import { Container } from 'inversify';

import { config } from './config';
import { PostgresDataSource } from './shared/adapters/out/postgres-datasource';
import { PinoLogger } from './shared/adapters/out/pino-logger';
import { LoggerOutputPort, LOGGER_OUTPUT_PORT } from './shared/ports/out/logger.output-port';
import { SqlCabinetRepository } from './cabinet/adapters/out/persistence/cabinet.repository.sql';
import { SqlDriverRepository } from './driver/adapters/out/persistence/driver.repository.sql';
import { SqlFrequencyRepository } from './frequency/adapters/out/persistence/frequency.repository.sql';
import { SqlImpulseRepository } from './impulse/adapters/out/persistence/impulse.repository.sql';
import { SqlOwnerRepository } from './owner/adapters/out/persistence/owner.repository.sql';
import { SqlImpedanceRepository } from './impedance/adapters/out/persistence/impedance.repository.sql';
import {
  CabinetRepositoryOutputPort,
  CABINET_REPOSITORY_OUTPUT_PORT,
} from './cabinet/core/application/ports/out/cabinet-repository.output-port';
import {
  DriverRepositoryOutputPort,
  DRIVER_REPOSITORY_OUTPUT_PORT,
} from './driver/core/application/ports/out/driver-repository.output-port';
import {
  FrequencyRepositoryOutputPort,
  FREQUENCY_REPOSITORY_OUTPUT_PORT,
} from './frequency/core/application/ports/out/frequency-repository.output-port';
import {
  ImpulseRepositoryOutputPort,
  IMPULSE_REPOSITORY_OUTPUT_PORT,
} from './impulse/core/application/ports/out/impulse-repository.output-port';
import {
  OwnerRepositoryOutputPort,
  OWNER_REPOSITORY_OUTPUT_PORT,
} from './owner/core/application/ports/out/owner-repository.output-port';
import {
  ImpedanceRepositoryOutputPort,
  IMPEDANCE_REPOSITORY_OUTPUT_PORT,
} from './impedance/core/application/ports/out/impedance-repository.output-port';
import { ExpressWebServer } from './shared/adapters/in/express-web-server';
import {
  RegisterOwnerInputPort,
  REGISTER_OWNER_INPUT_PORT,
} from './owner/core/application/ports/in/register-owner.input-port';
import { RegisterOwnerService } from './owner/core/application/services/register-owner.service';
import { RegisterOwnerController } from './owner/adapters/in/web/register-owner.controller';

import {
  RegisterDriverInputPort,
  REGISTER_DRIVER_INPUT_PORT,
} from './driver/core/application/ports/in/register-driver.input-port';
import { RegisterDriverService } from './driver/core/application/services/register-driver.service';
import { RegisterDriverController } from './driver/adapters/in/web/register-driver.controller';
import {
  RegisterCabinetInputPort,
  REGISTER_CABINET_INPUT_PORT,
} from './cabinet/core/application/ports/in/register-cabinet.input-port';
import { RegisterCabinetService } from './cabinet/core/application/services/register-cabinet.service';
import { RegisterCabinetController } from './cabinet/adapters/in/web/register-cabinet.controller';

import {
  GetCabinetsPerOwnerInputPort,
  GET_CABINETS_PER_OWNER_INPUT_PORT,
} from './cabinet/core/application/ports/in/get-cabinets-per-owner.input-port';
import { GetCabinetsPerOwnerService } from './cabinet/core/application/services/get-cabinets-per-owner.service';
import { GetCabinetsPerOwnerController } from './cabinet/adapters/in/web/get-cabinets-per-owner.controller';

import {
  RegisterFrequencyInputPort,
  REGISTER_FREQUENCY_INPUT_PORT,
} from './frequency/core/application/ports/in/register-frequency.input-port';
import { RegisterFrequencyService } from './frequency/core/application/services/register-frequency.service';
import { RegisterFrequencyController } from './frequency/adapters/in/web/register-frequency.controller';

import {
  RegisterImpedanceInputPort,
  REGISTER_IMPEDANCE_INPUT_PORT,
} from './impedance/core/application/ports/in/register-impedance.input-port';
import { RegisterImpedanceService } from './impedance/core/application/services/register-impedance.service';
import { RegisterImpedanceController } from './impedance/adapters/in/web/register-impedance.controller';
import {
  RegisterImpulseInputPort,
  REGISTER_IMPULSE_INPUT_PORT,
} from './impulse/core/application/ports/in/register-impulse.input-port';
import { RegisterImpulseService } from './impulse/core/application/services/register-impulse.service';
import { RegisterImpulseController } from './impulse/adapters/in/web/register-impulse.controller';
import {
  GetOwnersOverviewInputPort,
  GET_OWNERS_OVERVIEW_INPUT_PORT,
} from './owner/core/application/ports/in/get-owners-overview.input-port';
import { GetOwnersOverviewService } from './owner/core/application/services/get-owners-overview.service';
import { GetOwnersOverviewController } from './owner/adapters/in/web/get-owners-overview.controller';
import { GetMeasurementPerCabinetController } from './measurement/adapters/in/web/get-measurement-per-cabinet.controller';
import {
  GetMeasurementPerCabinetInputPort,
  GET_MEASUREMENT_PER_CABINET_INPUT_PORT,
} from './measurement/core/application/ports/in/get-measurement-per-cabinet.input-port';
import { GetMeasurementPerCabinetService } from './measurement/core/application/services/get-measurement-per-cabinet.service';
import {
  IMPULSE_MAPPER_OUTPUT_PORT,
  ImpulseMapperOutputPort,
} from './impulse/core/application/ports/out/impulse.mapper.output-port';
import { ImpulseMapper } from './impulse/adapters/out/impulse.mapper';
import {
  FREQUENCY_MAPPER_OUTPUT_PORT,
  FrequencyMapperOutputPort,
} from './frequency/core/application/ports/out/frequency.mapper.output-port';
import { FrequencyMapper } from './frequency/adapters/out/frequency.mapper';
import {
  IMPEDANCE_MAPPER_OUTPUT_PORT,
  ImpedanceMapperOutputPort,
} from './impedance/core/application/ports/out/impedance.mapper.output-port';
import { ImpedanceMapper } from './impedance/adapters/out/impedance.mapper';
import {
  MEASUREMENT_REPOSITORY_OUTPUT_PORT,
  MeasurementRepositoryOutputPort,
} from './measurement/core/application/ports/out/measurement-repository.output-port';
import { SqlMeasurementRepository } from './measurement/adapters/out/persistence/measurement.repository';
import {
  MEASUREMENT_QUERY_MAPPER_OUTPUT_PORT,
  MeasurementQueryMapperOutputPort,
} from './measurement/core/application/ports/out/measurement-query.mapper.output-port';
import { MeasurementQueryMapper } from './measurement/adapters/out/mappers/measurement-query.mapper';
import { MeasurementQueryResultMapper } from './measurement/adapters/out/mappers/measurement-query-result.mapper';
import { MEASUREMENT_QUERY_RESULT_MAPPER_OUTPUT_PORT } from './measurement/core/application/ports/out/measurement-query-result.mapper.output-port';

export const container = new Container({
  autoBindInjectable: true,
  defaultScope: 'Singleton',
  skipBaseClassChecks: true,
});

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
    container.get(GetCabinetsPerOwnerController),
    container.get(GetOwnersOverviewController),
    container.get(GetMeasurementPerCabinetController),
  ];
  return new ExpressWebServer(config.express, container.get(LOGGER_OUTPUT_PORT), controllers);
});

/**
 *  application services
 */
container.bind<RegisterOwnerInputPort>(REGISTER_OWNER_INPUT_PORT).to(RegisterOwnerService);
container.bind<RegisterCabinetInputPort>(REGISTER_CABINET_INPUT_PORT).to(RegisterCabinetService);
container.bind<RegisterDriverInputPort>(REGISTER_DRIVER_INPUT_PORT).to(RegisterDriverService);
container.bind<RegisterFrequencyInputPort>(REGISTER_FREQUENCY_INPUT_PORT).to(RegisterFrequencyService);
container.bind<RegisterImpedanceInputPort>(REGISTER_IMPEDANCE_INPUT_PORT).to(RegisterImpedanceService);
container.bind<RegisterImpulseInputPort>(REGISTER_IMPULSE_INPUT_PORT).to(RegisterImpulseService);
container.bind<GetCabinetsPerOwnerInputPort>(GET_CABINETS_PER_OWNER_INPUT_PORT).to(GetCabinetsPerOwnerService);
container.bind<GetOwnersOverviewInputPort>(GET_OWNERS_OVERVIEW_INPUT_PORT).to(GetOwnersOverviewService);
container
  .bind<GetMeasurementPerCabinetInputPort>(GET_MEASUREMENT_PER_CABINET_INPUT_PORT)
  .to(GetMeasurementPerCabinetService);

/**
 *  output/driven/secondary adapters
 */
container.bind<LoggerOutputPort>(LOGGER_OUTPUT_PORT).toDynamicValue(() => new PinoLogger(config.logger));
container
  .bind(PostgresDataSource)
  .toDynamicValue(() => new PostgresDataSource(config.postgres, container.get(LOGGER_OUTPUT_PORT)));
container.bind<CabinetRepositoryOutputPort>(CABINET_REPOSITORY_OUTPUT_PORT).to(SqlCabinetRepository);
container.bind<DriverRepositoryOutputPort>(DRIVER_REPOSITORY_OUTPUT_PORT).to(SqlDriverRepository);
container.bind<FrequencyRepositoryOutputPort>(FREQUENCY_REPOSITORY_OUTPUT_PORT).to(SqlFrequencyRepository);
container.bind<ImpulseRepositoryOutputPort>(IMPULSE_REPOSITORY_OUTPUT_PORT).to(SqlImpulseRepository);
container.bind<OwnerRepositoryOutputPort>(OWNER_REPOSITORY_OUTPUT_PORT).to(SqlOwnerRepository);
container.bind<ImpedanceRepositoryOutputPort>(IMPEDANCE_REPOSITORY_OUTPUT_PORT).to(SqlImpedanceRepository);
container.bind<MeasurementRepositoryOutputPort>(MEASUREMENT_REPOSITORY_OUTPUT_PORT).to(SqlMeasurementRepository);
container.bind<FrequencyMapperOutputPort>(FREQUENCY_MAPPER_OUTPUT_PORT).to(FrequencyMapper);
container.bind<ImpulseMapperOutputPort>(IMPULSE_MAPPER_OUTPUT_PORT).to(ImpulseMapper);
container.bind<ImpedanceMapperOutputPort>(IMPEDANCE_MAPPER_OUTPUT_PORT).to(ImpedanceMapper);
container.bind<MeasurementQueryMapperOutputPort>(MEASUREMENT_QUERY_MAPPER_OUTPUT_PORT).to(MeasurementQueryMapper);
container
  .bind<MeasurementQueryResultMapper>(MEASUREMENT_QUERY_RESULT_MAPPER_OUTPUT_PORT)
  .to(MeasurementQueryResultMapper);
