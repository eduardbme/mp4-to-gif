import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import { Validate } from '@mp4-to-gif/common/validate';
import {
  DocumentOutCreate1Cmd,
  DocumentOutCreateRequestDTO,
  DocumentOutCreateRequestDTORaw,
  DocumentOutCreateResponseDTO,
  DocumentOutEntity,
  DocumentOutEntityRaw,
  DocumentQueueTimeoutError,
  DocumentQueueUseCase,
} from '@mp4-to-gif-api/document/domain';
import { DocumentService } from './DocumentService';

@Injectable()
export class DocumentQueueApplication implements DocumentQueueUseCase {
  private static QUEUE_NAME = 'document-name';
  private static QUEUE_JOB_TIMEOUT_MS = 60_000;

  private static configValidation = Validate.compile(
    DocumentQueueApplication.configValidationSchema()
  );

  private config!: Config;
  private queue!: Queue;
  private worker!: Worker;

  constructor(private readonly documentService: DocumentService) {}

  init(config: Config) {
    this.config = Validate.assert(
      DocumentQueueApplication.configValidation,
      config
    );

    this.queue = new Queue<
      DocumentOutCreateRequestDTORaw,
      DocumentOutEntityRaw
    >(DocumentQueueApplication.QUEUE_NAME, {
      connection: { url: this.config.redis },
    });

    this.worker = new Worker<
      DocumentOutCreateRequestDTORaw,
      DocumentOutEntityRaw
    >(
      DocumentQueueApplication.QUEUE_NAME,
      this.onDocumentOutCreateJob.bind(this),
      {
        connection: { url: this.config.redis },
        concurrency: this.config.concurrency,
      }
    );
  }

  async down() {
    await this.worker.pause();
  }

  get queues() {
    return [this.queue];
  }

  async documentOutCreate(
    documentOutCreateRequestDTO: DocumentOutCreateRequestDTO
  ): Promise<DocumentOutCreateResponseDTO> {
    const job = await this.queue.add(uuid(), documentOutCreateRequestDTO.data);

    const documentOutRaw = await job
      .waitUntilFinished(
        new QueueEvents(DocumentQueueApplication.QUEUE_NAME),
        DocumentQueueApplication.QUEUE_JOB_TIMEOUT_MS
      )
      .catch((_) => {
        if (_.message?.includes('timed out before finishing')) {
          throw new DocumentQueueTimeoutError();
        }

        throw _;
      });
    const documentOut = new DocumentOutEntity(documentOutRaw);

    return new DocumentOutCreateResponseDTO({ documentOut });
  }

  private async onDocumentOutCreateJob(job: Job) {
    const documentOutCreate1Cmd = new DocumentOutCreate1Cmd(job.data);

    const documentOutEntity = await this.documentService.documentOutCreate(
      documentOutCreate1Cmd
    );

    return documentOutEntity.value;
  }

  private static configValidationSchema() {
    return {
      type: 'object',
      required: ['redis', 'concurrency'],
      properties: {
        redis: {
          type: 'string',
          minLength: 1,
          maxLength: 1_024,
        },
        concurrency: {
          type: 'number',
          minimum: 1,
          maximum: 1_000,
        },
      },
      additionalProperties: false,
    };
  }
}

interface Config {
  redis: string;
  concurrency: number;
}
