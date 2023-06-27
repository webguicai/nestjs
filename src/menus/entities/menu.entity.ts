import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Menus {
  @PrimaryGeneratedColumn('increment', { comment: '菜单id' })
  @IsNumber()
  id: number;

  @Column({ type: 'varchar', nullable: true, comment: '菜单名称' })
  menuName: string;

  @Column({ type: 'varchar', nullable: true, comment: '菜单编号' })
  menuCode: string;

  @Column({ type: 'varchar', nullable: true, comment: '菜单父编号' })
  menuParentCode: string;

  // 1启用 2禁用
  @Column({ type: 'enum',enum: [1, 2], comment: '菜单状态',
  default: 2, })
  status: number;

  // 1目录 2菜单
  @Column({
    type: 'enum',
    enum: [1, 2],
    comment: '菜单类型',
    default: 1,
  })
  type: number;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: string;
}
