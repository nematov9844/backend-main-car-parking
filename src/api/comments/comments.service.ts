import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, ReservationEntity } from 'src/core/entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>
  ) { }

  async create(createCommentDto: CreateCommentDto, user_id: string) {
    try {

      const reservation = await this.reservationRepository.find({ where: { spot_id: createCommentDto.spot_id } })

      if (reservation.length === 0) {
        throw new NotFoundException('Reservation not found')
      }
      const comment = this.commentRepository.create({ ...createCommentDto, user_id });
      const savedComment = await this.commentRepository.save(comment);
      return {
        message: 'Created',
        status: 201,
        data: savedComment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Comment creation failed');
    }
  }

  async findAll() {
    try {
      const comments = await this.commentRepository.find();
      return {
        message: 'Success',
        status: 200,
        data: comments,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve comments');
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });
      if (!comment) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }
      return {
        message: 'Success',
        status: 200,
        data: comment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve comment');
    }
  }
  async findBySpotId(id: string) {
    try {
      const comments = await this.commentRepository.find({ where: { id } });
      if (!comments) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }
      return {
        message: 'Success',
        status: 200,
        data: comments,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve comment');
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const result = await this.commentRepository.update(id, updateCommentDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }
      const updatedComment = await this.commentRepository.findOne({ where: { id } });
      return {
        message: 'Updated',
        status: 200,
        data: updatedComment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Comment update failed');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.commentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }
      return {
        message: 'Deleted',
        status: 200,
        data: { id },
      };
    } catch (error) {
      throw new InternalServerErrorException('Comment deletion failed');
    }
  }
}
