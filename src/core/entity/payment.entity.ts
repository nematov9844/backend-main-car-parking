import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { CardEntity } from './card.entity';

@Entity()
export class PaymentEntity extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['card', 'cash', 'mobile'], default: 'card' })
  payment_method: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  payment_status: string;

  @Column({ type: 'uuid', name: 'reservation_id' })
  reservation_id: string;

  @Column({ type: 'uuid', name: 'card_id' })
  card_id: string | null;

  // Relations
  @OneToOne(() => ReservationEntity, (reservation) => reservation.payment)
  @JoinColumn({ name: 'reservation_id' })
  reservation: ReservationEntity;

  @ManyToOne(() => CardEntity, (card) => card.payments)
  @JoinColumn({ name: 'card_id' })
  card: CardEntity;
}
