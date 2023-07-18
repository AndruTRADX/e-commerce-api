import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        maxAge: 86400000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
