import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  NotContains,
} from 'class-validator';
import { UUID } from 'crypto';
import { Trim } from 'src/common/decorator/trim.decorator';

export class AddGroupReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @Trim()
  label: string;

  @ApiProperty({ nullable: true })
  @IsUUID()
  @IsOptional()
  parentId: UUID | null;
}
