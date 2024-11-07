import { ExtendableError } from '@mp4-to-gif/common/domain';

export class DocumentQueueTimeoutError extends ExtendableError {
  constructor() {
    super('Document queue timeout error');
  }
}
