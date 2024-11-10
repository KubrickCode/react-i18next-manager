import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class EditTranslationsParentGroupReqBodyTranslation {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class EditTranslationsParentGroupReqBodyDto {
  @ApiProperty({ type: [EditTranslationsParentGroupReqBodyTranslation] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditTranslationsParentGroupReqBodyTranslation)
  translations: EditTranslationsParentGroupReqBodyTranslation[];

  @ApiProperty()
  @IsUUID()
  newGroupId: UUID;
}
