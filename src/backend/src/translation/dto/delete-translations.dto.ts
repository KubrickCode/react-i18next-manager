import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class DeleteTranslationsReqBodyTranslation {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class DeleteTranslationsReqBodyDto {
  @ApiProperty({ type: [DeleteTranslationsReqBodyTranslation] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeleteTranslationsReqBodyTranslation)
  translations: DeleteTranslationsReqBodyTranslation[];
}
