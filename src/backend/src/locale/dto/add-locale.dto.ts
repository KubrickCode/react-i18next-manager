import { IsInt, IsString } from 'class-validator';

export class AddLocaleReqBodyDto {
  @IsString()
  label: string;

  @IsInt()
  position: number;
}
