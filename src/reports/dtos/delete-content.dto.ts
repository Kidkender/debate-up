import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteContentDto {
  @IsNotEmpty()
  @IsNumber()
  contentId: number;

  @IsNotEmpty()
  contentType: string;
}
