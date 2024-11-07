import { ExtendableError } from '@mp4-to-gif/common/domain';

export class ValidationError extends ExtendableError {
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
