import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from 'src/core/entity/reservation.entity';
import { ParkingSpotEntity, UserEntity } from 'src/core/entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,

    @InjectRepository(ParkingSpotEntity)
    private readonly parkingRepository: Repository<ParkingSpotEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(dto: CreateReservationDto, userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reservations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const spot = await this.parkingRepository.findOne({
      where: { id: dto.spot_id },
    });

    if (!spot) {
      throw new NotFoundException('Parking spot not found');
    }

    const newReservation = this.reservationRepository.create({
      ...dto,
      user,
      spot,
    });

    const savedReservation =
      await this.reservationRepository.save(newReservation);
    return {
      status: 201,
      message: 'Rezervatsiya muvaffaqiyatli yaratildi',
      data: savedReservation,
    };
  }

  async findAll(): Promise<any> {
    const reservations = await this.reservationRepository.find({
      relations: ['user', 'spot'],
    });
    return {
      status: 200,
      message: 'Barcha rezervatsiyalar muvaffaqiyatli topildi',
      data: reservations,
    };
  }

  async findOne(id: string): Promise<any> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'spot', 'payment'],
    });

    if (!reservation) {
      throw new NotFoundException(`Rezervatsiya ID: ${id} topilmadi!`);
    }

    return {
      status: 200,
      message: `Rezervatsiya muvaffaqiyatli topildi (ID: ${id})`,
      data: reservation,
    };
  }

  async findOneByUserId(id: string): Promise<any> {
    const reservation = await this.reservationRepository.find({
      where: { user: { id } },
      relations: ['user', 'spot', 'payment'],
    });

    if (!reservation.length) {
      throw new NotFoundException(`Rezervatsiya topilmadi (User ID: ${id})`);
    }

    return {
      status: 200,
      message: `Rezervatsiya muvaffaqiyatli topildi (User ID: ${id})`,
      data: reservation,
    };
  }

  async update(id: string, dto: UpdateReservationDto): Promise<any> {
    const reservation = await this.findOne(id);
    Object.assign(reservation, dto);
    const updatedReservation =
      await this.reservationRepository.save(reservation);
    return {
      status: 200,
      message: `Rezervatsiya muvaffaqiyatli yangilandi (ID: ${id})`,
      data: updatedReservation,
    };
  }

  async remove(id: string): Promise<any> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
    return {
      status: 200,
      message: `Rezervatsiya muvaffaqiyatli o‘chirildi (ID: ${id})`,
      data: { id },
    };
  }
}
