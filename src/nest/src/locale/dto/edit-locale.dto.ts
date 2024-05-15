import { IsInt, IsOptional, IsString } from 'class-validator';

export class EditLocaleReqParamDto {
  @IsString()
  id: string;
}

export class EditLocaleReqBodyDto {
  @IsString()
  @IsOptional()
  newLabel?: string;

  @IsInt()
  @IsOptional()
  newPosition?: number;
}
