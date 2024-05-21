import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use(express.static(join(__dirname, '.')));

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, 'index.html'));
    } else {
      next();
    }
  });

  await app.listen(3001);
};

bootstrap();
