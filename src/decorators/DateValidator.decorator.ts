import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    return typeof text === 'string' && DateTime.fromISO(text).isValid;
  }

  defaultMessage(args: ValidationArguments) {
    return '($value) must be a valid date string';
  }
}
