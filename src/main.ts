import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './my-logger/my-logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
// import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useLogger(app.get(MyLoggerService));
  app.enableCors();
  app.setGlobalPrefix('api');

  // 接口版本控制
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });
  await app.listen(3000);
}
bootstrap();
