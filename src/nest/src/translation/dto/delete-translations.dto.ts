import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

export class DeleteTranslationsReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  ids: UUID[];
}
