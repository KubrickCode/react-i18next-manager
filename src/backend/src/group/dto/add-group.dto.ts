import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class AddGroupReqBodyDto {
  @IsString()
  label: string;

  @IsUUID()
  @IsOptional()
  parentId: UUID | null;
}
