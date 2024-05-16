import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Group {
  @IsUUID()
  id: UUID;

  @IsInt()
  newPosition: number;
}

export class EditGroupsPositionReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  groups: Group[];
}
