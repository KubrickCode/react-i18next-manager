import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ResponseDtoInterceptor } from 'src/common/decorator/response-dto.decorator';
import { GetGroupsResDto } from './dto/get-groups.dto';
import { DeleteGroupReqParamDto } from './dto/delete-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseDtoInterceptor(GetGroupsResDto)
  async getGroups() {
    return await this.groupService.getGroups();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Param() { id }: DeleteGroupReqParamDto) {
    return await this.groupService.deleteGroup({ id });
  }
}
