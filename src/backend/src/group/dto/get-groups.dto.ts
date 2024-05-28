import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'src/common/types';

class Group {
  @IsUUID()
  id: UUID;

  @IsString()
  label: string;

  @IsUUID()
  parentId: UUID;

  @IsInt()
  position: number;
}

export class GetGroupsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Group)
  groups: Group[];
}
