import path from 'path';
import { ExpressConfig } from './shared/adapters/in/express-web-server';
import { LogLevel, LoggerConfig } from './shared/ports/out/logger.output-port';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  readonly logger: LoggerConfig;
  readonly express: ExpressConfig;
}

export const config: Config = {
  logger: {
    level: LogLevel.Info,
  },
  express: {
    port: Number(process.env.EXPRESS_SERVER_PORT) as number,
    corsOrigin: process.env.EXPRESS_SERVER_CORS_ORIGIN as string,
    hostname: process.env.EXPRESS_SERVER_HOSTNAME as string,
    asbKeyUrl: process.env.ASB_KEY_URL as string,
  },
};
