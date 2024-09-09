import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieSession from 'cookie-session';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://arotdar-fe.vercel.app',
      'https://arotdar-fe.fly.dev',
    ],
    credentials: true,
  });

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

  const config = new DocumentBuilder()
    .setTitle('Arotdar app backend')
    .setDescription(
      'Backend for an app that implements a simple inventory mangement system for a particular client',
    )
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
