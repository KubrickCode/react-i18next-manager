import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetGroupsResDto } from './dto/get-groups.dto';
import { DeleteGroupReqParamDto } from './dto/delete-group.dto';
import { AddGroupReqBodyDto } from './dto/add-group.dto';
import {
  EditGroupLabelReqBodyDto,
  EditGroupLabelReqParamDto,
} from './dto/edit-group-label.dto';
import {
  EditGroupPositionReqBodyDto,
  EditGroupPositionReqParamDto,
} from './dto/edit-group-position.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetGroupsResDto)
  async getAll() {
    return await this.groupService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() body: AddGroupReqBodyDto) {
    return await this.groupService.add(body);
  }

  @Patch('position/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editPosition(
    @Param() param: EditGroupPositionReqParamDto,
    @Body() body: EditGroupPositionReqBodyDto,
  ) {
    return await this.groupService.editPosition({
      ...param,
      ...body,
    });
  }

  @Patch('label/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editLabel(
    @Param() param: EditGroupLabelReqParamDto,
    @Body() body: EditGroupLabelReqBodyDto,
  ) {
    return await this.groupService.editLabel({
      ...param,
      ...body,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: DeleteGroupReqParamDto) {
    return await this.groupService.delete({ id });
  }
}
