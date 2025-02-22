import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentEntity } from 'src/core/entity/payment.entity';
import { CardEntity, ReservationEntity } from 'src/core/entity';
import { CardsService } from '../cards/cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, CardEntity, ReservationEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
