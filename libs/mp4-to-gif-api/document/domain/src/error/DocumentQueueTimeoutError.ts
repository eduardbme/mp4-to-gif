import { ExtendableError } from '@common/domain';

export class DocumentQueueTimeoutError extends ExtendableError {
  constructor() {
    super('Document queue timeout error');
  }
}
