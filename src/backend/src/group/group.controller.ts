import {
  Body,
  Controller,
  Delete,
  Get,
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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOkResponse({ type: GetGroupsResDto })
  @ResponseDtoInterceptor(GetGroupsResDto)
  async getAll() {
    return await this.groupService.getAll();
  }

  @Post()
  @ApiCreatedResponse({ type: GetGroupsResDto })
  async add(@Body() body: AddGroupReqBodyDto) {
    return await this.groupService.add(body);
  }

  @Patch('label/:id')
  @ApiNoContentResponse()
  async editLabel(
    @Param() param: EditGroupLabelReqParamDto,
    @Body() body: EditGroupLabelReqBodyDto,
  ) {
    return await this.groupService.editLabel({
      ...param,
      ...body,
    });
  }

  @Patch('position/:id')
  @ApiNoContentResponse()
  async editPosition(
    @Param() param: EditGroupPositionReqParamDto,
    @Body() body: EditGroupPositionReqBodyDto,
  ) {
    return await this.groupService.editPosition({
      ...param,
      ...body,
    });
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async delete(@Param() { id }: DeleteGroupReqParamDto) {
    return await this.groupService.delete({ id });
  }
}
