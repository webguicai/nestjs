import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  account: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}

export class UserDetailDto {
  @ApiProperty({ description: 'id' })
  @IsNumberString()
  id: string;
}

export class UsersListDto {
  @ApiProperty({ description: '手机号', required: false })
  phone: string;

  @ApiProperty({ description: '姓名', required: false })
  userName: string;

  @ApiProperty({ description: '性别', required: false })
  gender: string;

  @ApiProperty({ description: '当前页数' })
  @IsNumberString()
  current: number;

  @ApiProperty({ description: '每页条数' })
  @IsNumberString()
  pageSize: number;
}

export class UserEditDto {
  @ApiProperty({ description: 'id' })
  @IsNumberString()
  id: string;

  @ApiProperty({ description: '手机号' })
  @IsNumberString()
  phone: string;

  @ApiProperty({ description: '性别' })
  @IsNumberString()
  gender: string;
}

export class CreateUserDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  account: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;

  @ApiProperty({ description: '用户姓名' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '电话' })
  @IsNumberString()
  phone: string;

  @ApiProperty({ description: '性别' })
  @IsNumber()
  gender: number;
}
