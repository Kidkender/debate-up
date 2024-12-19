import { IsNotEmpty } from 'class-validator';

export class DebateRequestDto {
  @IsNotEmpty()
  content: string;
}
