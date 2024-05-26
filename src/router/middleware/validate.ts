import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  validationResult,
  Result,
  FieldValidationError,
} from 'express-validator';

export default (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: ValidationError[] = [];
  errors
    .array({ onlyFirstError: true })
    .map((err: ValidationError) => extractedErrors.push(err));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
