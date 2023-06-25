import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      database: 'nest',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 500
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
