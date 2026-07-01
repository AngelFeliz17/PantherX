import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, process.env.PHONE_URL],
    credentials: true
  })
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();