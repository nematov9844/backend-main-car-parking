import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ParkingSpotEntity } from './parking-spot.entity';
import { UserEntity } from './user.entity';
import { PaymentEntity } from './payment.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class ReservationEntity extends BaseEntity {
  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  })
  status: string;

  @Column({
    type: 'uuid',
    name: 'spot_id',
  })
  spot_id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  user_id: string;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ParkingSpotEntity, (spot) => spot.reservations)
  @JoinColumn({ name: 'spot_id' })
  spot: ParkingSpotEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.reservation)
  payment: PaymentEntity;
}
