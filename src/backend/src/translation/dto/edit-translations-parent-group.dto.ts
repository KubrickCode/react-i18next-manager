import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Translation {
  @IsUUID()
  id: UUID;
}

export class EditTranslationsParentGroupReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  translations: Translation[];

  @IsUUID()
  newGroupId: UUID;
}
