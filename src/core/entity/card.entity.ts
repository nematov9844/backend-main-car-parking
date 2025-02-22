import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { PaymentEntity } from './payment.entity';

@Entity('card')
export class CardEntity extends BaseEntity {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Foydalanuvchi UUID',
  })
  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @ApiProperty({
    example: 100.50,
    description: 'Kartadagi mablag‘',
  })
  @Column({ name: 'money', type: 'decimal' })
  money: number;

  @ApiProperty({
    example: '8600123456789012',
    description: 'Karta raqami',
  })
  @Column({ name: 'card_number', type: 'varchar' })
  card_number: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Kartaga tegishli ism',
  })
  @Column({ name: 'card_holder_name', type: 'varchar' })
  card_holder_name: string;

  @ApiProperty({
    example: '12/27',
    description: 'Kartaning amal qilish muddati (MM/YY formatida)',
  })
  @Column({ name: 'expiration_date', type: 'varchar' })
  expiration_date: string;

  @ApiProperty({ type: () => UserEntity, description: 'Kartaga tegishli foydalanuvchi' })
  @ManyToOne(() => UserEntity, (user) => user.cards)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ type: () => [PaymentEntity], description: 'Karta orqali amalga oshirilgan to‘lovlar' })
  @OneToMany(() => PaymentEntity, (payment) => payment.card)
  payments: PaymentEntity[];
}
