import {
  isEmail,
  maxLength,
  minLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEmailOrUsername', async: false })
export class IsEmailOrUsername implements ValidatorConstraintInterface {
  validate(login: string) {
    return isEmail(login) || (minLength(login, 3) && maxLength(login, 16));
  }

  defaultMessage() {
    return 'Неверный формат email или username';
  }
}
