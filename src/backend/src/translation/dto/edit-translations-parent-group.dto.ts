import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'src/common/types';

class Translation {
  @ApiProperty()
  @IsUUID()
  id: UUID;
}

export class EditTranslationsParentGroupReqBodyDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Translation)
  translations: Translation[];

  @ApiProperty()
  @IsUUID()
  newGroupId: UUID;
}
