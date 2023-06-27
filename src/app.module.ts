import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ path: '' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Jyc@1234',
      database: 'cashier_system',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 500,
    }),
    MenusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
