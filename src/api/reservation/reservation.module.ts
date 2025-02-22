import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from 'src/core/entity/reservation.entity';
import { CommentEntity, ParikingImageEntity, ParkingSpotEntity, UserEntity } from 'src/core/entity';
import { ParkingSpotService } from '../parking-spot/parking-spot.service';
import { UserService } from '../users/user.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt';
import { UserController } from '../users/user.controller';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { ParkingGateway } from 'src/common/socket/parking.gateway';
import { CommentsService } from '../comments/comments.service';
import { FileModule } from 'src/common/multer/multer.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      ParkingSpotEntity,
      UserEntity,
      CommentEntity,
      ParikingImageEntity,
    ]),
    FileModule
  ],
  controllers: [ReservationController, UserController],
  providers: [
    ReservationService,
    UserService,
    BcryptService,
    RedisCacheService,
    ParkingGateway,
    CommentsService,
    ParkingSpotService,
  ],
  exports: [ReservationService],
})
export class ReservationModule { }
