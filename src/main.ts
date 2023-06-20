import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { ResponseFun, HttpFilter } from './common/response';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

const whiteList = [];

function MiddleWareAll(req: Request, res: Response, next: NextFunction) {
  if (whiteList.includes(req.originalUrl)) {
    res.send({ code: 500, message: '禁止访问' });
  } else {
    next();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('接口文档')
    .setDescription('接口文档')
    .setVersion('3')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
  app.use(cors());
  app.useGlobalInterceptors(new ResponseFun(new JwtService()));
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );
  app.use(MiddleWareAll);
  app.use(
    session({
      secret: 'system',
      rolling: true,
      name: 'session',
      cookie: {
        maxAge: null,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
