import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { ValidationPipe } from '@pipes/validationPipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'upload'));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');
  await app.listen(port);
}
bootstrap();
