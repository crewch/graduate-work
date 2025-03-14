import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserEntity;
}
