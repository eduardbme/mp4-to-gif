import Ajv, { ValidateFunction } from 'ajv/dist/2020';
import AjvFormats from 'ajv-formats';
import AjvKeywords from 'ajv-keywords';
import def from 'ajv-keywords/dist/definitions/dynamicDefaults';
import instanceofDef from 'ajv-keywords/dist/definitions/instanceof';
import { v4 as uuid } from 'uuid';
import { AssertError, ValidationError } from './error';

def.DEFAULTS['uuid'] = () => uuid;

export class Validate {
  private static ajv = AjvFormats(AjvKeywords(new Ajv()));

  static compile(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...classes: Array<new (...args: any[]) => any>
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ValidateFunction<any> {
    classes.forEach((_) => (instanceofDef.CONSTRUCTORS[_.name] = _));
    return Validate.ajv.compile(schema);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate<T, R = T>(validateFunction: ValidateFunction<any>, data: T) {
    const valid = validateFunction(data);
    if (valid) {
      return data as unknown as R;
    }

    throw new ValidationError(Validate.buildErrorMessage(validateFunction));
  }

  static assert<T, R = T>(
    validateFunction: ValidateFunction<unknown>,
    data: T
  ) {
    const valid = validateFunction(data);
    if (valid) {
      return data as unknown as R;
    }

    throw new AssertError(Validate.buildErrorMessage(validateFunction));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static buildErrorMessage(validateFunction: ValidateFunction<any>) {
    return validateFunction.errors
      ? validateFunction.errors
          .map((_) => `${_.schemaPath} ${_.message}`)
          .join(';')
      : Validate.ajv.errorsText(validateFunction.errors);
  }
}
