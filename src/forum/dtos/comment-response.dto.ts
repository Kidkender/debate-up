import { Exclude, Expose, Type } from 'class-transformer';

class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  avatarUrl: string;
}

@Exclude()
export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  comment: string;

  @Type(() => UserResponseDto)
  @Expose()
  user: UserResponseDto;
}
