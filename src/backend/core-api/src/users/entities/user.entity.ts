import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password_hash: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
