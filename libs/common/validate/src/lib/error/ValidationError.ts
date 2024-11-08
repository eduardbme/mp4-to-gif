import { ExtendableError } from '@common/domain';

export class ValidationError extends ExtendableError {
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
