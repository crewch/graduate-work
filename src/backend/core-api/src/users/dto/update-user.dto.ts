import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 1600,
    description: 'Новый рейтинг пользователя',
  })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
