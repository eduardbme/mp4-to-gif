import { v4 as uuid } from 'uuid';
import {
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Validate } from '@mp4-to-gif/common/validate';
import { exceptionToNull } from '@mp4-to-gif/common/util';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import {
  DocumentInCreateCmd,
  DocumentInEntity,
  DocumentOutEntity,
  DocumentRepository,
  DocumentSignedUrlGetCmd,
  DocumentSignedUrlVO,
} from '@mp4-to-gif-api/document/domain';

@Injectable()
export class S3DocumentRepository implements DocumentRepository {
  private static DELIMITER = '/';

  private static configValidation = Validate.compile(
    S3DocumentRepository.configValidationSchema()
  );

  private config!: Config;
  private s3!: S3Client;

  async init(config: Config) {
    this.config = Validate.assert(
      S3DocumentRepository.configValidation,
      config
    );

    this.s3 = new S3Client({
      credentials: this.config.credentials
        ? { ...this.config.credentials }
        : undefined,
      endpoint: this.config.endpoint,
      region: this.config.region,
      forcePathStyle: true,
    });

    await exceptionToNull(
      () =>
        this.s3.send(new CreateBucketCommand({ Bucket: this.config.bucket })),
      BucketAlreadyOwnedByYou
    );
  }

  async documentInCreate(
    documentInCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity> {
    const { documentMimetype, documentStream } = documentInCreateCmd.value;

    const documentKey = ['in', uuid()].join(S3DocumentRepository.DELIMITER);

    await new Upload({
      client: this.s3,
      params: {
        Bucket: this.config.bucket,
        Key: documentKey,
        ContentType: documentMimetype,
        Body: documentStream,
      },
    }).done();

    return new DocumentInEntity({
      documentKey: [this.config.bucket, documentKey].join(
        S3DocumentRepository.DELIMITER
      ),
    });
  }

  async documentOutCreate(
    documentInCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity> {
    const { documentMimetype, documentStream } = documentInCreateCmd.value;

    const documentKey = ['out', uuid()].join(S3DocumentRepository.DELIMITER);

    await new Upload({
      client: this.s3,
      params: {
        Bucket: this.config.bucket,
        Key: documentKey,
        ContentType: documentMimetype,
        Body: documentStream,
      },
    }).done();

    return new DocumentOutEntity({
      documentKey: [this.config.bucket, documentKey].join(
        S3DocumentRepository.DELIMITER
      ),
    });
  }

  async documentSignedUrlGet(
    documentSignedUrlGetCmd: DocumentSignedUrlGetCmd
  ): Promise<DocumentSignedUrlVO> {
    const { documentKey } = documentSignedUrlGetCmd.value;

    const [bucket, ...documentKey1] = documentKey.split(
      S3DocumentRepository.DELIMITER
    );

    const documentSignedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: documentKey1.join(S3DocumentRepository.DELIMITER),
      }),
      {
        // expiresIn 1d
        expiresIn: 24 * 60 * 60,
      }
    );

    return new DocumentSignedUrlVO({ documentKey, documentSignedUrl });
  }

  private static configValidationSchema() {
    return {
      type: 'object',
      required: ['bucket'],
      properties: {
        credentials: {
          type: 'object',
          required: ['accessKeyId', 'secretAccessKey'],
          properties: {
            accessKeyId: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            secretAccessKey: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
          },
          additionalProperties: false,
        },
        endpoint: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        region: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        bucket: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
      additionalProperties: false,
    };
  }
}

interface Config {
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
  region?: string;
  bucket: string;
}
