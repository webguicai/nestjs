import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('increment', { comment: '用户id' })
  id: number;

  @Column({ type: 'varchar', nullable: true, comment: '姓名' })
  userName: string;

  @Column({ type: 'varchar', nullable: true, comment: '账号' })
  account: string;

  @Column({ type: 'varchar', select: true, nullable: true, comment: '密码' })
  password: string;

  @Column({ type: 'varchar', nullable: true, comment: '手机号' })
  phone: string;

  // 0未知 1男 2 女
  @Column({ type: 'enum', enum: [0, 1, 2], default: 0, comment: '性别' })
  gender: number;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: string;

  // 1 正常 2 删除
  @Column({ type: 'enum', enum: [1, 2], default: 1, comment: '状态' })
  status: number;

  @Column({ type: 'timestamp', comment: '过期时间', nullable: true })
  expirationTime: string;

  @Column({ type: 'varchar', length: 1000, comment: 'token', nullable: true })
  token: string;
}
