import { ExtendableError } from '@common/domain';

export class AssertError extends ExtendableError {
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
