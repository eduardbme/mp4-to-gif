import { EventEmitter } from 'events';
import http from 'http';
import bodyParser from 'body-parser';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import express from 'express';
import cors from 'cors';
import serverDestroy from 'server-destroy';
import { Validate } from '@common/validate';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import { HttpApiServerError } from './error';
import { healthcheck, v1 } from './route';
import { LoggerWithContext } from '@mp4-to-gif-api/common/logger';
import { loggerContext, requestContext } from './middleware';

enum STATUS {
  STOPPED,
  STOPPING,
  STARTING,
  STARTED,
}

@Injectable()
export class HttpApiServer extends EventEmitter {
  private static configValidation = Validate.compile(
    HttpApiServer.configValidationSchema()
  );

  private readonly timeoutMs = 5000;
  private status: STATUS = STATUS.STOPPED;
  private config!: Config;
  private logger!: LoggerWithContext;
  private app!: express.Application;

  server!: http.Server;

  init(config: Config, logger: LoggerWithContext, queues: Queue[]) {
    this.config = Validate.validate(HttpApiServer.configValidation, config);
    this.logger = logger.create('[HttpApiServer]');

    this.app = express();

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/ui');

    createBullBoard({
      queues: queues.map((_) => new BullMQAdapter(_)),
      serverAdapter,
    });

    this.server = http.createServer(this.app);
    serverDestroy(this.server);

    this.app.disable('etag');

    this.app.use(
      cors({
        origin: this.config.origins,
      })
    );

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(requestContext());
    this.app.use(loggerContext(logger));

    this.app.use('/healthcheck', healthcheck());
    this.app.use('/api', v1());
    this.app.use('/ui', serverAdapter.getRouter());

    this.app.use(this.invalidPathHandler);
    this.app.use(this.errorHandler);
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.status !== STATUS.STOPPED) {
        throw new HttpApiServerError('status !== HttpApiServer.STATUS.STOPPED');
      }

      this.status = STATUS.STARTING;

      this.server.on('error', (error) => {
        reject(error);
      });

      const timeoutTimer = setTimeout(() => {
        reject(new HttpApiServerError('Start timeout'));
      }, this.timeoutMs);

      this.server.listen(
        {
          host: this.config.host,
          port: this.config.port,
        },
        () => {
          clearTimeout(timeoutTimer);

          this.logger.info(
            `server is listening on port ${this.config.port}...`
          );

          this.server.removeAllListeners('error');

          this.server.on('error', this.onServerError);

          this.status = STATUS.STARTED;

          resolve();
        }
      );
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.status !== STATUS.STARTED) {
        return;
      }

      this.status = STATUS.STOPPING;

      const timeoutTimer = setTimeout(() => {
        reject(new HttpApiServerError('Stop timeout'));
      }, this.timeoutMs);

      this.server.destroy((error?: Error) => {
        clearTimeout(timeoutTimer);

        this.server.removeAllListeners();

        if (error) {
          return reject(error);
        }

        this.status = STATUS.STOPPED;

        return resolve();
      });
    });
  }

  private readonly invalidPathHandler = (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    return res.status(400).json({ code: 1404, message: 'Invalid path' });
  };

  private readonly errorHandler = (
    error: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const errorId = this.logger.error(`Internal error: ${error.message}`, {
      error,
    });

    return res
      .status(400)
      .json({ code: 1500, message: 'Internal error', errorId });
  };

  private readonly onServerError = (error: Error): void => {
    this.emit('error', error);
  };

  private static configValidationSchema() {
    return {
      type: 'object',
      required: ['host', 'port', 'origins'],
      properties: {
        host: {
          type: 'string',
          minLength: 1,
          maxLength: 1_000,
        },
        port: {
          type: 'number',
          minimum: 1,
          maximum: 65_535,
        },
        origins: {
          type: 'array',
          minItems: 1,
          maxItems: 1_000,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 1_000,
          },
        },
      },
      additionalProperties: false,
    };
  }
}

interface Config {
  host: string;
  port: number;
  origins: string[];
}
