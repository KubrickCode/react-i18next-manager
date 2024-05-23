import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development' ? ['log', 'error'] : ['error'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use(express.static(join(__dirname, '.')));

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(join(__dirname, 'index.html'));
      } else {
        next();
      }
    },
  );

  console.log('I18n studio is running on port', process.env.PORT || 4321);

  await app.listen(Number(process.env.PORT || 4321));
};

bootstrap();
