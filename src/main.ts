import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieSession from 'cookie-session';
import { AppModule } from './app.module';

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
