import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins, methods, and headers
  app.use(cors());
  await app.listen(3002);
}
bootstrap();
