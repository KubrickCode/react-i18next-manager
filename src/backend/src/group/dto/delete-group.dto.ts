import { IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class DeleteGroupReqParamDto {
  @IsUUID()
  id: UUID;
}
