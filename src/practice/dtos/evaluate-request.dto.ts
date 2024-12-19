import { IsNotEmpty } from 'class-validator';

export class EvaluateRequestDto {
  @IsNotEmpty()
  essay: string;
}
