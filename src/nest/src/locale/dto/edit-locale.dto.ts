import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditLocaleReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditLocaleReqBodyDto {
  @IsString()
  @IsOptional()
  newLabel?: string;

  @IsInt()
  @IsOptional()
  newPosition?: number;
}
