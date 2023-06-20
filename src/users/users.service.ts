import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as svgCapcha from 'svg-captcha';
import { LoginUserDto, UserDetailDto, UserEditDto,UsersListDto } from './dto/users.dto';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt';
import dayjs = require('dayjs');
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
    private jwt: JwtService,
  ) {}

  createCode() {
    return svgCapcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#cc9966',
    });
  }

  async login(LoginUserDto: LoginUserDto) {
    const sqlData = await this.users.findOneBy({
      account: LoginUserDto.account,
      password: LoginUserDto.password,
    });
    if (!sqlData) return { message: '账号或密码错误', data: sqlData };
    const resData = omit(sqlData, ['password', 'token']);
    const token = this.jwt.sign({ ...resData }, jwtConstants);
    this.users.update(
      { id: sqlData.id },
      {
        token,
        expirationTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      },
    );
    return { data: token };
  }

  async currentUser(req) {
    const decodeToken: any = this.jwt.decode(req.headers.authorization);
    const sqlData = await this.users.findOneBy({
      id: decodeToken.id,
    });
    if (dayjs().valueOf() > dayjs(sqlData.expirationTime).valueOf())
      new UnauthorizedException('请重新登录');
    const resData = omit(sqlData, ['password', 'token', 'expirationTime']);
    return { data: resData };
  }

  outLogin(req) {
    const decodeToken: any = this.jwt.decode(req.headers.authorization);
    this.users.update(
      {
        id: decodeToken.id,
      },
      {
        token: null,
        expirationTime: null,
      },
    );
    return { data: null };
  }

  async usersList(UsersListDto: UsersListDto) {
    const {
      current,
      pageSize,
      nickName = '',
      phone = '',
      gender,
      userName = '',
    } = UsersListDto;
    const sqlData = await this.users.findAndCount({
      where: {
        nickName: Like(`%${nickName}%`),
        phone: Like(`%${phone}%`),
        userName: Like(`%${userName}%`),
        gender: gender ? Number(gender) : null,
      },
      select: ['id', 'nickName', 'userName', 'phone', 'gender'],
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    return { data: sqlData[0], total: sqlData[1], page: Number(current) };
  }

  async userDetail(UserDetailDto: UserDetailDto) {
    const { id } = UserDetailDto;
    const sqlData = await this.users.findOne({
      where: { id: Number(id) },
      select: ['id', 'nickName', 'userName', 'phone', 'gender'],
    });
    return { data: sqlData };
  }

  async userEdit(UserEditDto: UserEditDto) {
    const { id, gender, ...others } = UserEditDto;
    this.users.update(
      { id: Number(id) },
      { gender: Number(gender), ...others },
    );
    return { data: null };
  }
}
