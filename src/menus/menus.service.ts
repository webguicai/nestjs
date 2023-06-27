import { Injectable } from '@nestjs/common';
import { CreateMenuDto, MenuListDto, UpdateMenuDto } from './dto/menus.dto';
import { Menus } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menus) private readonly menus: Repository<Menus>,
  ) {}

  async getMenuByType(type: number) {
    return {
      data: await this.menus.find({
        where: {
          type: type,
        },
      }),
    };
  }

  async getMenuDetail(id: number) {
    return {
      data: await this.menus.findOneBy({
        id,
      }),
    };
  }

  async getMenuList(MenuListDto: MenuListDto) {
    const {
      current,
      pageSize,
      menuName = '',
      menuCode = '',
      status,
    } = MenuListDto;

    const whereObj = !!status
      ? {
          menuName: Like(`%${menuName}%`),
          menuCode: Like(`%${menuCode}%`),
          type: 1,
          status: Number(status),
        }
      : {
          menuName: Like(`%${menuName}%`),
          menuCode: Like(`%${menuCode}%`),
          type: 1,
        };

    const sqlDataFc = async (sqlObj) => {
      return await this.menus.findAndCount(sqlObj);
    };

    let sqlData = await sqlDataFc({
      where: whereObj,
      select: ['id', 'menuName', 'menuCode', 'status', 'type'],
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    const sqlDataMap = [...sqlData[0]].map(async (item) => {
      let childrenSqlData: any = [];
      if (item.type === 1) {
        childrenSqlData = await sqlDataFc({
          where: {
            menuParentCode: item.menuCode,
          },
          select: ['id', 'menuName', 'menuCode', 'status', 'type'],
        });
      }
      return { ...item, children: childrenSqlData[0].length > 0? childrenSqlData[0]: null };
    });

    return {
      data: await Promise.all(sqlDataMap),
      total: sqlData[1],
      page: Number(current),
    };
  }

  deleteMenu(id: number) {
    this.menus.delete({ id });
    return { data: null };
  }

  async createMenu(CreateMenuDto: CreateMenuDto) {
    const isHasOne = await this.menus.findOneBy({
      menuCode: CreateMenuDto.menuCode,
    });
    if (isHasOne) return { data: null, message: '已存在对应菜单编号' };
    this.menus.save(CreateMenuDto);
    const id = await this.menus.find({
      where: { menuCode: CreateMenuDto.menuCode },
      select: ['id'],
    });
    return {
      data: id,
    };
  }

  async updateMenu(UpdateMenuDto: UpdateMenuDto) {
    this.menus.update({ id: UpdateMenuDto.id }, UpdateMenuDto);
    return {
      data: null,
    };
  }
}
