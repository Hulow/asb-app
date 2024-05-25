import { Container } from 'inversify';

import { config } from './config'
import { ExpressController, ExpressWebServer } from './shared/adapters/in/express-web-server';

import { PinoLogger } from './shared/adapters/out/pino-logger';
import { LOGGER_OUTPUT_PORT, LoggerOutputPort } from './shared/ports/out/logger.output-port';

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
  ] as ExpressController[]
  return new ExpressWebServer(config.express, container.get(LOGGER_OUTPUT_PORT), controllers);
});

/**
 *  application services
 */

/**
 *  output/driven/secondary adapters
 */
container.bind<LoggerOutputPort>(LOGGER_OUTPUT_PORT).toDynamicValue(() => new PinoLogger(config.logger));
