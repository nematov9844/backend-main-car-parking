import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity, ReservationEntity } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, ReservationEntity]), ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
