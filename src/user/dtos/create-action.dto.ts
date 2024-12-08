import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateActionUser {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @MinLength(10)
  reason: string;
}
