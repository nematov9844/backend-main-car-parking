import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity, UserEntity } from 'src/core/entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createCardDto: CreateCardDto, userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User not found with ID: ${userId}`);
      }

      const card = this.cardRepository.create({ ...createCardDto, user });
      const savedCard = await this.cardRepository.save(card);

      return {
        message: 'Created',
        status: 201,
        data: savedCard,
      };
    } catch (error) {
      throw new InternalServerErrorException('Card creation failed');
    }
  }

  async findAll() {
    try {
      const cards = await this.cardRepository.find();
      return {
        message: 'Success',
        status: 200,
        data: cards,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve cards');
    }
  }

  async findUserCardsById(userId: string) {
    try {
      const cards = await this.cardRepository.find({
        where: { user: { id: userId } },
      });
      return {
        message: 'Success',
        status: 200,
        data: cards,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user cards');
    }
  }

  async findOne(id: string) {
    try {
      const card = await this.cardRepository.findOne({ where: { id } });
      if (!card) {
        throw new NotFoundException(`Card not found with ID: ${id}`);
      }
      return {
        message: 'Success',
        status: 200,
        data: card,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve card');
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    try {
      const result = await this.cardRepository.update(id, updateCardDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Card not found with ID: ${id}`);
      }
      const updatedCard = await this.cardRepository.findOne({ where: { id } });
      return {
        message: 'Updated',
        status: 200,
        data: updatedCard,
      };
    } catch (error) {
      throw new InternalServerErrorException('Card update failed');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.cardRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Card not found with ID: ${id}`);
      }
      return {
        message: 'Deleted',
        status: 200,
        data: { id },
      };
    } catch (error) {
      throw new InternalServerErrorException('Card deletion failed');
    }
  }
}
