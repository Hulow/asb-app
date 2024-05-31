/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path'
import { ExpressConfig } from './shared/adapters/in/express-web-server'
import { LogLevel, LoggerConfig } from './shared/ports/out/logger.output-port'
import { PostgresConfig } from './shared/adapters/out/postgres-datasource'

require('dotenv').config({
  path: path.resolve(__dirname, '../../shared/env/.env'),
})

interface Config {
  readonly logger: LoggerConfig
  readonly express: ExpressConfig
  readonly postgres: PostgresConfig
}

export const config: Config = {
  logger: {
    level: LogLevel.Info,
  },
  express: {
    port: Number(process.env.EXPRESS_SERVER_PORT),
    corsOrigin: process.env.EXPRESS_SERVER_CORS_ORIGIN!,
    hostname: process.env.EXPRESS_SERVER_HOSTNAME!,
    asbKeyUrl: process.env.ASB_KEY_URL!,
  },
  postgres: {
    host: process.env.POSTGRES_HOSTNAME!,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  },
}
