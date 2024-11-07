import config from 'config';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import { Logger, LoggerWithContext } from '@mp4-to-gif-api/common/logger';
import {
  DocumentQueueApplication,
  DocumentService,
  S3DocumentRepository,
} from '@mp4-to-gif-api/document/adapter';
import { HttpApiServer } from './interface/http-api-server';

@Injectable()
export class App {
  readonly appName = 'App';
  readonly loggerWithContext!: LoggerWithContext;

  constructor(
    readonly logger: Logger,
    private readonly httpApiServer: HttpApiServer,
    private readonly documentQueueApplication: DocumentQueueApplication,
    private readonly documentRepository: S3DocumentRepository,
    private readonly documentService: DocumentService
  ) {
    this.loggerWithContext = new LoggerWithContext(
      this.logger,
      `${this.appName} ${process.pid}`
    );
  }

  async init(): Promise<void> {
    const logger = this.loggerWithContext.create(this.init.name);

    await this.logger.init({
      ...config.get('logger'),
      env: config.get('env'),
    });
    logger.info('logger up');

    await this.documentRepository.init(config.get('document.repository'));
    logger.info('documentRepository up');

    this.documentQueueApplication.init({
      redis: config.get('redis'),
      concurrency: config.get('document.concurrency'),
    });
    logger.info('documentQueueApplication up');

    this.documentService.init(this.loggerWithContext);
    logger.info('documentService up');

    this.httpApiServer.init(
      config.get('httpApiServer'),
      this.loggerWithContext,
      this.documentQueueApplication.queues
    );
    this.httpApiServer.on('error', this.onHttpApiServerError);
    await this.httpApiServer.start();
    logger.info('httpApiServer up');

    logger.info('init done');
  }

  async destroy() {
    const logger = this.loggerWithContext.create(this.destroy.name);
    let errored = false;

    await this.httpApiServer.stop().catch((_) => {
      errored = true;
      logger.error(`Internal error: ${_.message}`, { error: _ });
    });
    this.httpApiServer.removeListener('error', this.onHttpApiServerError);
    logger.info('httpApiServer down');

    await this.documentQueueApplication.down();
    logger.info('documentQueueApplication down');

    logger.info('logger going to down');
    await this.logger.flush();

    return errored;
  }

  readonly onHttpApiServerError = (error: Error) => {
    this.logger.error(`Http Api Server Error Event: ${error.message}`, {
      error,
    });
  };
}
