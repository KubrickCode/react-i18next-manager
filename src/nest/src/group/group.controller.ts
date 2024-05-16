import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetGroupsResDto } from './dto/get-groups.dto';
import { DeleteGroupReqParamDto } from './dto/delete-group.dto';
import { AddGroupReqBodyDto } from './dto/add-group.dto';

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Param() { id }: DeleteGroupReqParamDto) {
    return await this.groupService.deleteGroup({ id });
  }
}
