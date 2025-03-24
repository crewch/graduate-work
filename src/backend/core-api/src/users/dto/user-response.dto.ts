import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }

  userId: string;

  username: string;

  email: string;

  @Exclude()
  @ApiHideProperty()
  passwordHash: string;

  rating: number;

  createdAt: Date;

  updatedAt: Date;
}
