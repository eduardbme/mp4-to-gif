import { PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import { LoggerWithContext } from '@mp4-to-gif-api/common/logger';
import {
  DocumentInCreateCmd,
  DocumentInEntity,
  DocumentOutCreate1Cmd,
  DocumentOutCreate2Cmd,
  DocumentOutEntity,
  DocumentOutMimetype,
  DocumentOutReadableStream,
  DocumentUseCase,
} from '@mp4-to-gif-api/document/domain';
import { S3DocumentRepository } from '../outbound';

@Injectable()
export class DocumentService implements DocumentUseCase {
  private logger!: LoggerWithContext;

  constructor(private readonly documentRepository: S3DocumentRepository) {}

  init(logger: LoggerWithContext) {
    this.logger = logger.create(DocumentService.name);
  }

  async documentOutCreate(
    documentOutConvertCmd: DocumentOutCreate1Cmd
  ): Promise<DocumentOutEntity> {
    const logger = this.logger.create(this.documentOutCreate.name);

    const documentSignedUrlVO =
      await this.documentRepository.documentSignedUrlGet(documentOutConvertCmd);
    const { documentSignedUrl } = documentSignedUrlVO.value;

    const stream = new PassThrough();

    ffmpeg(documentSignedUrl, { logger })
      .inputFormat('mp4')
      .outputOptions(['-movflags frag_keyframe+empty_moov'])
      .outputOptions(['-vf fps=5,scale=-1:400'])
      .outputFormat('gif')
      .on('start', (commandLine) => {
        logger.debug('ffmpeg start', { commandLine });
      })
      .on('error', (error) => logger.debug('ffmpeg error', { error }))
      .on('end', () => {
        logger.debug('ffmpeg end');
      })
      .pipe(stream);

    return this.documentRepository.documentOutCreate(
      new DocumentOutCreate2Cmd({
        documentMimetype: 'image/gif' as DocumentOutMimetype,
        documentStream: stream as DocumentOutReadableStream,
      })
    );
  }

  documentInCreate(
    uploadDocumentCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity> {
    return this.documentRepository.documentInCreate(uploadDocumentCreateCmd);
  }
}
