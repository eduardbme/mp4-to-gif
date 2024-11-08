import { Readable } from 'stream';

export type DocumentInReadableStream = Branded<
  Readable,
  'DocumentInReadableStream'
>;
