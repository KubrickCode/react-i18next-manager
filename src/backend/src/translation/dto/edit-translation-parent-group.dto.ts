import { IsUUID } from 'class-validator';
import { UUID } from 'src/common/types';

export class EditTranslationParentGroupReqBodyDto {
  @IsUUID()
  newGroupId: UUID;
}

export class EditTranslationParentGroupReqParamDto {
  @IsUUID()
  id: UUID;
}
