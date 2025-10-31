import { IsString, MaxLength, Matches } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @Matches(/^https?:\/\//, { message: 'URL must start with http:// or https://' })
  url: string;
}
