import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  AllExceptionsFilter,
  ApiDocReady,
  configureCors,
  logApplicationDetails,
  logServerReady,
  setupSecurity,
} from './common';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

const port: number = 3333;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupSecurity(app);

  const configService = app.get(ConfigService);
  configureCors(app, configService);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(configService.get('port') || port);
  return configService;
}
bootstrap().then((configService) => {
  logServerReady(configService.get('port') || port);
  logApplicationDetails(configService);
  ApiDocReady(configService.get('port') || port, configService);
});
