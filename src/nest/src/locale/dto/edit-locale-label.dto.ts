import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditLocaleLabelReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditLocaleLabelReqBodyDto {
  @IsString()
  @IsOptional()
  newLabel?: string;
}
