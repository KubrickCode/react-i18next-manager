import { IsString, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditLocaleLabelReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditLocaleLabelReqBodyDto {
  @IsString()
  newLabel: string;
}
