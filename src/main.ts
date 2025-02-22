import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './config';
import { ValidationPipe } from '@nestjs/common';
import { UUIDInterceptor } from './common/pipe/isuuid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // DTOda bo‘lmagan maydonlarni avtomatik olib tashlaydi
      // forbidNonWhitelisted: true, // DTOda bo‘lmagan maydonlarni jo‘natishga ruxsat bermaydi
      transform: true, // So‘rov ma’lumotlarini avtomatik DTO formatiga o‘tkazadi
    }),
  );
  app.useGlobalInterceptors(new UUIDInterceptor()); //uuid larni uuid formatiga tekshiradi agar xato uuid jonatilsa param da error throw qiladi
  app.enableCors({
    origin: '*', // Barcha domenlarga ruxsat beradi (Ishlab chiqish uchun)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const swagger = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.PORT, () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const ids = [
      "8334f9f6-927e-4fec-a0b3-a925f49acc98",
      "1c373b18-43b3-423f-b97e-78329b46e624",
      "85c6f4c0-03a3-40fa-930b-7b5ef996716d",
      "1ae17a8a-e662-4181-85c8-8a90d2b90f08",
      "555f5e89-766f-45e5-9a2e-ea213d0c6edf"
    ];

    ids.forEach(id => {
      if (!uuidRegex.test(id)) {
        console.log(`Xato UUID: ${id}`);
      }
    });

    console.log(`Running in ${config.PORT}`);
  });
}
bootstrap();
