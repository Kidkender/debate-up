import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResultReponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  topic: string;

  @Expose()
  userResponse: string;

  @Expose()
  aiResponse: string;

  @Expose()
  feedback_score: number;

  @Expose()
  createdAt: Date;
}
