import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from 'data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('API para gestión de hoteles, habitaciones y reservas')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'apiKeyAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //ejecutar migraciones en produccion
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('Initializing datasource...');
      await AppDataSource.initialize();

      console.log('Running migrations...');
      await AppDataSource.runMigrations();

      console.log('✔ Migrations executed successfully');
    } catch (error) {
      console.error('❌ Error running migrations:', error);
    }
  } else {
    console.log('Skipping migrations (not in production)');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
