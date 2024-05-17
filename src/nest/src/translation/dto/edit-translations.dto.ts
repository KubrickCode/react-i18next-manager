import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Translation {
  @IsUUID()
  id: UUID;

  @IsString()
  value: string;
}

export class EditTranslationsReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  newTranslations: Translation[];
}
