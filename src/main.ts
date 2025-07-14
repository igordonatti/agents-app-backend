import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Config Chatbot API')
    .setDescription(
      'API para gerenciamento de chatbots configuráveis com sistema multi-tenant',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Endpoints para autenticação de usuários')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Tenants', 'Gerenciamento de tenants')
    .addTag('Agents', 'Gerenciamento de agentes de chatbot')
    .addTag('Knowledge Base', 'Gerenciamento da base de conhecimento')
    .addTag('App', 'Endpoints gerais da aplicação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();
