import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { ParkingSpotEntity } from './parking-spot.entity';

@Entity('card')
export class ParkingCardEntity extends BaseEntity {

    @Column({ name: 'parking_id', type: 'uuid' })
    parking_id: string;

    @Column({ name: 'money', type: 'decimal' })
    money: number;

    @Column({ name: 'card_number', type: 'varchar' })
    card_number: string;

    @Column({ name: 'card_holder_name', type: 'varchar' })
    card_holder_name: string;

    @Column({ name: 'expiration_date', type: 'varchar' })
    expiration_date: string;

    // @ApiProperty({ type: () => ParkingSpotEntity, description: 'Kartaga tegishli foydalanuvchi' })
    // @ManyToOne(() => ParkingSpotEntity, (spot) => spot.cards)
    // @JoinColumn({ name: 'parking_id' })
    // spot: ParkingSpotEntity;

    @ApiProperty({ type: () => [PaymentEntity], description: 'Karta orqali amalga oshirilgan to‘lovlar' })
    @OneToMany(() => PaymentEntity, (payment) => payment.card)
    payments: PaymentEntity[];
}
