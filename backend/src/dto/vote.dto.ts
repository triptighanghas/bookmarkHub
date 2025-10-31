import { IsInt, IsIn } from 'class-validator';

export class VoteDto {
  @IsInt()
  bookmarkId: number;

  @IsIn([1, -1])
  value: number;
}
