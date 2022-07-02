import { HttpErrorResponse } from '@angular/common/http';

import { InvalidSchemaError } from '../errors/InvalidSchemaError';
import { InvalidEmailOrPasswordError } from './../errors/InvalidEmailOrPasswordError';

export function returnAuthRoutesError(err: HttpErrorResponse) {
  if (err.status == 401) {
    const invalidEmailOrPassword = new InvalidEmailOrPasswordError()
    return {
      message: invalidEmailOrPassword.message,
      name: invalidEmailOrPassword.name
    }
  }

  if (err.status === 422) {
    const invalidSchema = new InvalidSchemaError()
    return {
      message: invalidSchema.message,
      name: invalidSchema.name
    }
  }

  return {
    ...err,
    name: 'Error',
    message: 'Something went wrong, try again or reload'
  }
}
