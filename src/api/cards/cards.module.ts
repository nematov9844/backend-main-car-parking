import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity, UserEntity } from 'src/core/entity';
import { UserService } from '../users/user.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity, UserEntity])],
  controllers: [CardsController],
  providers: [CardsService, UserService, BcryptService],
  exports: [CardsService],
})
export class CardsModule {}
