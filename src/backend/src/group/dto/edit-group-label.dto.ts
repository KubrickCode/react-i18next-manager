import { IsString, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditGroupLabelReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditGroupLabelReqBodyDto {
  @IsString()
  newLabel: string;
}
