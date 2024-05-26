import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddGroupReqBodyDto {
  @IsString()
  @Trim()
  label: string;

  @IsUUID()
  @IsOptional()
  parentId: UUID | null;
}
