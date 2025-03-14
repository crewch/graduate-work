import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Имя пользователя',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Пароль пользователя (минимум 6 символов, хотя бы одна заглавная буква и цифра)',
  })
  @IsStrongPassword()
  password_hash: string;
}
