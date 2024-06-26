import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Server } from 'http'
import { HttpError } from 'http-errors'
import { injectable } from 'inversify'

import { LoggerOutputPort } from '../../ports/out/logger.output-port'

export interface ExpressController {
  method: 'get' | 'post' | 'put' | 'delete'
  route: string
  handler: express.RequestHandler
}

export interface ExpressConfig {
  readonly port: number
  readonly hostname: string
  readonly corsOrigin: string
  readonly asbKeyUrl: string
}

@injectable()
export class ExpressWebServer {
  private _server!: Server
  public app: Express

  constructor(
    private readonly _config: ExpressConfig,
    private _logger: LoggerOutputPort,
    controllers: ExpressController[],
  ) {
    this.app = express()

    this.app.use(express.json({ limit: '20mb' }))

    this.app.use(cors({ origin: this._config.corsOrigin }))

    this._setupAuthorization()

    this._setBasicRoutes()

    this._setRoutes(controllers)

    this._setupErrorHandler()
  }

  start() {
    return new Promise<void>(res => {
      this._server = this.app.listen(
        this._config.port,
        this._config.hostname,
        () => {
          this._logger.info(
            `Express server is running on http://${this._config.hostname}:${this._config.port}`,
          )
          res()
        },
      )
    })
  }

  stop() {
    return new Promise<void>((res, rej) => {
      if (!this._server.listening) return res()

      this._server.close(err => {
        if (!err) return res()

        this._logger.error('Error while stopping express server', err)
        rej(err)
      })
    })
  }

  private _setupAuthorization() {
    this.app.use(
      (_request: Request, response: Response, _next: NextFunction) => {
        if (!_request.headers.authorization) {
          return response.status(403).json({ error: 'Forbidden' })
        }
        if (_request.headers.authorization !== this._config.asbKeyUrl) {
          return response.status(401).json({ error: 'Unauthorized' })
        }
        return _next()
      },
    )
  }

  private _setBasicRoutes() {
    this.app.get('/health', (_, res) => res.status(200).send('OK'))
    this.app.get('/ready', (_, res) => res.status(200).send('OK'))
  }

  private _setRoutes(routes: ExpressController[] = []) {
    for (const route of routes) {
      this._setRoute(route)
    }
  }

  private _setRoute(controller: ExpressController) {
    this.app[controller.method](
      controller.route,
      asyncHandler(controller.handler.bind(controller)),
    )
  }

  private _setupErrorHandler() {
    this.app.use(
      (err: Error | HttpError, _request: Request, response: Response) => {
        this._logger.error(err)
        if (response.headersSent) {
          return
        }

        switch (err.message) {
          case 'Unauthorized': {
            response.status(401).send({ error: 'Unauthorized' })
            break
          }
          default: {
            response.status(500).send({ error: err.message })
          }
        }
      },
    )
  }
}
