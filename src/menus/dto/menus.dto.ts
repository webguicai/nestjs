import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsString()
  menuName: string;

  @ApiProperty({ description: '菜单编号' })
  @IsString()
  menuCode: string;

  @ApiProperty({ description: '菜单类型' })
  @IsNumber()
  type: number;

  @ApiProperty({ description: '父级菜单', required: false })
  menuParentCode: string;

  @ApiProperty({ description: '菜单状态' })
  @IsNumber()
  status: number;
}

export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  id: number;
}

export class MenuListDto {
  @ApiProperty({ description: '菜单名称' })
  menuName: string;

  @ApiProperty({ description: '菜单编号' })
  menuCode: string;

  @ApiProperty({ description: '菜单状态' })
  status: string;

  @ApiProperty({ description: '当前页数' })
  @IsNumberString()
  current: number;

  @ApiProperty({ description: '每页条数' })
  @IsNumberString()
  pageSize: number;
}
