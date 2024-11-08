import { ExtendableError } from '@common/domain';

export class HttpApiServerError extends ExtendableError {
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
