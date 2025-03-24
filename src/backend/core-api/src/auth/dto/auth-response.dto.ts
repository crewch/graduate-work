import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  accessToken: string;

  user: UserResponseDto;
}
