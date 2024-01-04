import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.use(
    cookieSession({
      secret: process.env.COOKIE_SECRET,
    }),
  );
  await app.listen(3000);
}
bootstrap();
