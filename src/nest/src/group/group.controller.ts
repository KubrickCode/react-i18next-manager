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
  async getGroups() {
    return await this.groupService.getGroups();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addLocale(@Body() body: AddGroupReqBodyDto) {
    return await this.groupService.addGroup(body);
  }

  @Patch('position/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editGroupPosition(
    @Param() param: EditGroupPositionReqParamDto,
    @Body() body: EditGroupPositionReqBodyDto,
  ) {
    return await this.groupService.editGroupPosition({
      ...param,
      ...body,
    });
  }

  @Patch('label/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editLocale(
    @Param() param: EditGroupLabelReqParamDto,
    @Body() body: EditGroupLabelReqBodyDto,
  ) {
    return await this.groupService.editGroupLabel({
      ...param,
      ...body,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Param() { id }: DeleteGroupReqParamDto) {
    return await this.groupService.deleteGroup({ id });
  }
}
