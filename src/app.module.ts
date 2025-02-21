import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { config } from './config';
import { RolesGuardModule } from './common/guards/roles.module';
// import { MiddlewareModule } from './common/middleware/midlleware.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UserModule,
    AuthModule,
    RolesGuardModule,
    // MiddlewareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
