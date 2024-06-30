import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  NotContains,
} from 'class-validator';
import { UUID } from 'crypto';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddGroupReqBodyDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  label: string;

  @IsUUID()
  @IsOptional()
  parentId: UUID | null;
}
