import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

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

  const port = Number(process.env.PORT) || 4321;

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV === 'development') {
    writeFileSync('./swagger-spec.json', JSON.stringify(document));
  }
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(
    `\x1b[36m%s\x1b[0m`,
    `I18n studio is running on http://localhost:${port}`,
  );
};

bootstrap();
