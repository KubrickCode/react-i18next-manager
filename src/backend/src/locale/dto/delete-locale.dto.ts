import { IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class DeleteLocaleReqParamDto {
  @IsUUID()
  id: UUID;
}
