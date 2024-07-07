import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditGroupPositionReqParamDto {
  @IsUUID()
  id: UUID;
}

export class EditGroupPositionReqBodyDto {
  @IsUUID()
  @IsOptional()
  parentId: UUID | null;

  @IsInt()
  position: number;
}
