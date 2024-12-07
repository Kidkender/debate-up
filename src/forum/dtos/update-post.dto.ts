import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  postId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
