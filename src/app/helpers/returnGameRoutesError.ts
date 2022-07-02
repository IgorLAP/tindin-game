import { HttpErrorResponse } from '@angular/common/http';

import { GameNotFoundError } from '../errors/GameNotFoundError';
import { InvalidSchemaError } from '../errors/InvalidSchemaError';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

export function returnGameRoutesError(err: HttpErrorResponse) {
  if (err.status == 401) {
    const notAuthorized = new NotAuthorizedError()
    return {
      message: notAuthorized.message,
      name: notAuthorized.name
    }
  }

  if (err.status == 412) {
    const gameNotFound = new GameNotFoundError()
    return {
      message: gameNotFound.message,
      name: gameNotFound.name
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
