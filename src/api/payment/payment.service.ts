import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from 'src/core/entity/payment.entity';
import { CardEntity, ReservationEntity } from 'src/core/entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,

    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<any> {
    const card = await this.cardRepository.findOne({ where: { id: dto.card_id } });
    if (!card) {
      throw new NotFoundException(`Karta ID: ${dto.card_id} topilmadi!`);
    }

    const reservation = await this.reservationRepository.findOne({ where: { id: dto.reservation_id } });
    if (!reservation) {
      throw new NotFoundException(`Rezervatsiya ID: ${dto.reservation_id} topilmadi!`);
    }

    try {
      const newPayment = this.paymentRepository.create({
        ...dto,
        card,
        reservation,
      });
      const savedPayment = await this.paymentRepository.save(newPayment);
      return {
        status: 201,
        message: 'To‘lov muvaffaqiyatli yaratildi',
        data: savedPayment,
      };
    } catch (error) {
      throw new BadRequestException('To‘lovni yaratishda xatolik yuz berdi');
    }
  }

  async findAll(): Promise<any> {
    try {
      const payments = await this.paymentRepository.find({
        relations: ['reservation'],
      });
      return {
        status: 200,
        message: 'Barcha to‘lovlar muvaffaqiyatli topildi',
        data: payments,
      };
    } catch (error) {
      throw new BadRequestException('To‘lovlarni olishda xatolik yuz berdi');
    }
  }

  async findAllWithUserId(id: string): Promise<any> {
    try {
      const payments = await this.paymentRepository.find({
        where: { reservation: { user: { id } } },
        relations: ['reservation'],
      });
      return {
        status: 200,
        message: 'Barcha to‘lovlar muvaffaqiyatli topildi',
        data: payments,
      };
    } catch (error) {
      throw new BadRequestException('Foydalanuvchi to‘lovlarini olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['reservation'],
    });
    if (!payment) {
      throw new NotFoundException(`To‘lov ID: ${id} topilmadi!`);
    }
    return {
      status: 200,
      message: `To‘lov muvaffaqiyatli topildi (ID: ${id})`,
      data: payment,
    }
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`To‘lov ID: ${id} topilmadi!`);
    }

    try {
      Object.assign(payment, dto);
      const updatedPayment = await this.paymentRepository.save(payment);
      return {
        status: 200,
        message: `To‘lov muvaffaqiyatli yangilandi (ID: ${id})`,
        data: updatedPayment,
      };
    } catch (error) {
      throw new BadRequestException(`To‘lovni yangilashda xatolik yuz berdi`);
    }
  }

  async remove(id: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`To‘lov ID: ${id} topilmadi!`);
    }

    try {
      await this.paymentRepository.remove(payment);
      return {
        status: 200,
        message: `To‘lov muvaffaqiyatli o‘chirildi (ID: ${id})`,
        data: { id },
      };
    } catch (error) {
      throw new BadRequestException(`To‘lovni o‘chirishda xatolik yuz berdi`);
    }
  }
}
