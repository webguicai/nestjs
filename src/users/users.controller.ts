import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Session,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginUserDto,
  UsersListDto,
  UserDetailDto,
  UserEditDto,
} from './dto/users.dto';
import { UsersPipe } from './users.pipe';

@Controller('users')
@ApiBearerAuth()
@ApiTags('用户接口')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('createCode')
  @ApiOperation({ summary: '获取验证码', description: '获取验证码' })
  createCode(@Req() req, @Res() res, @Session() session) {
    const code = this.usersService.createCode();
    session.code = code.text;
    res.type('image/svg+xml');
    res.send(code.data);
  }

  @Post('createUser')
  @ApiOperation({ summary: '注册', description: '注册' })
  createUser(
    @Body(UsersPipe) CreateUserDto: CreateUserDto,
    @Session() session,
  ) {
    if (
      session?.code?.toLocaleLowerCase() ===
      CreateUserDto?.code?.toLocaleLowerCase()
    ) {
      return { data: CreateUserDto };
    }
    return null;
  }

  @Get('login')
  @ApiOperation({ summary: '登录', description: '登录' })
  async login(@Query() LoginUserDto: LoginUserDto, @Session() session) {
    const token = (await this.usersService.login(LoginUserDto)).data;
    session.token = token;
    return this.usersService.login(LoginUserDto);
  }

  @Get('currentUser')
  @ApiOperation({ summary: '获取登录用户信息', description: '获取登录用户信息' })
  async currentUser(@Req() req) {
    return this.usersService.currentUser(req);
  }

  @Get('outLogin')
  @ApiOperation({ summary: '退出登录', description: '退出登录' })
  async outLogin(@Req() req) {
    return this.usersService.outLogin(req);
  }

  @Get('usersList')
  @ApiOperation({ summary: '用户列表', description: '用户列表' })
  async usersList(@Query() UsersListDto: UsersListDto) {
    return this.usersService.usersList(UsersListDto);
  }

  @Get('userDetail')
  @ApiOperation({ summary: '用户详情', description: '用户详情' })
  async userDetail(@Query() UserDetailDto: UserDetailDto) {
    return this.usersService.userDetail(UserDetailDto);
  }

  @Patch('userEdit')
  @ApiOperation({ summary: '编辑用户', description: '编辑用户' })
  async userEdit(@Query() UserEditDto: UserEditDto) {
    return this.usersService.userEdit(UserEditDto);
  }
}
