import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Hippocratic API')
  .setDescription('API for managing healthcare data with privacy specifications')
  .setVersion('0.1')
  .addTag('Privacy')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(); // Enable CORS
  await app.listen(3000);
}
bootstrap();
1