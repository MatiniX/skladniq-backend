import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(
      'C:\\Users\\uzivatel\\Desktop\\skladniq\\skladniq-backend\\src\\certs\\localhost-key.pem',
    ),
    cert: fs.readFileSync(
      'C:\\Users\\uzivatel\\Desktop\\skladniq\\skladniq-backend\\src\\certs\\localhost.pem',
    ),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const config = new DocumentBuilder()
    .setTitle('Skladniq API')
    .setDescription('Documentation for Skladniq API')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'JWT authetification with refresh tokens',
      type: 'http',
    })
    .addCookieAuth('rt', { type: 'apiKey' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser('cookie-secret'));
  app.enableCors({
    credentials: true,
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  });

  app.listen(3000);
}
bootstrap();
