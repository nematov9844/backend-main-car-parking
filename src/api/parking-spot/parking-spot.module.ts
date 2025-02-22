import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpotService } from './parking-spot.service';
import { ParkingSpotController } from './parking-spot.controller';
import { ParkingSpotEntity } from 'src/core/entity/parking-spot.entity';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { ParkingGateway } from 'src/common/socket/parking.gateway';
import { FileModule } from 'src/common/multer/multer.module';
import { ParikingImageEntity, UserEntity } from 'src/core/entity';
import { UserService } from '../users/user.service';
import { CommentsModule } from '../comments/comments.module';
import { BcryptService } from 'src/common/bcrypt/bcrypt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingSpotEntity, ParikingImageEntity, ParikingImageEntity, UserEntity]),
    FileModule,
    CommentsModule,
  ],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService, RedisCacheService, ParkingGateway, UserService, BcryptService],
})
export class ParkingSpotModule { }
