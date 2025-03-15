import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, Validate } from 'class-validator';
import { IsEmailOrUsername } from '../validators/email-or-username.validator';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com или john_doe',
    description: 'Email или имя пользователя',
  })
  @IsString()
  @Validate(IsEmailOrUsername)
  login: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Пароль пользователя (минимум 6 символов, хотя бы одна заглавная буква и цифра)',
  })
  @IsStrongPassword()
  passwordHash: string;
}
