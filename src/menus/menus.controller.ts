import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto, MenuListDto, UpdateMenuDto } from './dto/menus.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('menus')
@ApiBearerAuth()
@ApiTags('菜单接口')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('getMenuByType')
  @ApiOperation({ summary: '通过类型获取菜单', description: '通过类型获取菜单' })
  getMenuByType(@Query('type') type: number ) {
    return this.menusService.getMenuByType(type);
  }

  @Get('getMenuDetail')
  @ApiOperation({ summary: '获取菜单详情', description: '获取菜单详情' })
  getMenuDetail(@Query('id') id: number ) {
    return this.menusService.getMenuDetail(id);
  }

  @Get('getMenuList')
  @ApiOperation({ summary: '获取菜单列表', description: '获取菜单列表' })
  getMenuList(@Query() MenuListDto: MenuListDto) {
    return this.menusService.getMenuList(MenuListDto);
  }

  @Delete('deleteMenu')
  @ApiOperation({ summary: '删除菜单', description: '删除菜单' })
  async deleteMenu(@Query('id') id: number) {
    return this.menusService.deleteMenu(id);
  }

  @Post('createMenu')
  @ApiOperation({ summary: '创建菜单', description: '创建菜单' })
  async createMenu(@Body() CreateMenuDto: CreateMenuDto) {
    return this.menusService.createMenu(CreateMenuDto);
  }

  @Post('updateMenu')
  @ApiOperation({ summary: '编辑菜单', description: '编辑菜单' })
  async updateMenu(@Body() UpdateMenuDto: UpdateMenuDto) {
    return this.menusService.updateMenu(UpdateMenuDto);
  }
}
