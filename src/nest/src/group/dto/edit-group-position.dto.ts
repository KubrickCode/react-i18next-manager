import { IsInt, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditGroupPositionReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditGroupPositionReqBodyDto {
  @IsInt()
  position: number;
}
