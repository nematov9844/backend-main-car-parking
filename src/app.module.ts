import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/users/user.module';
import { config } from './config';
// import { RolesGuardModule } from './common/guards/roles.module';
import { CustomJwtModule } from './common/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomJwtService } from './common/jwt/jwt-auth.guard';
import { CardsModule } from './api/cards/cards.module';
import { CommentsModule } from './api/comments/comments.module';
import { MailModule } from './common/mailer/mailer.module';
import { AdminModule } from './api/admin/admin.module';
import { CardEntity, CommentEntity, UserEntity } from './core/entity';
import { ReservationEntity } from './core/entity/reservation.entity';
import { ParkingSpotEntity } from './core/entity/parking-spot.entity';
import { PaymentEntity } from './core/entity/payment.entity';
import { ParkingSpotModule } from './api/parking-spot/parking-spot.module';
import { PaymentModule } from './api/payment/payment.module';
import { ReservationModule } from './api/reservation/reservation.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { FileModule } from './common/multer/multer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        port: config.REDIS_PORT,
        host: 'localhost',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DATABASE_URL,
      entities: [
        UserEntity,
        ReservationEntity,
        ParkingSpotEntity,
        PaymentEntity,
        CardEntity,
        CommentEntity,
        ParkingSpotEntity
      ],
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UserModule,
    AuthModule,
    FileModule,
    // RolesGuardModule,
    CustomJwtModule,
    CardsModule,
    CommentsModule,
    MailModule,
    AdminModule,
    ParkingSpotModule,
    PaymentModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomJwtService,
    },
  ],
})
export class AppModule {}
