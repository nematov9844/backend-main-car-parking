import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ParkingSpotEntity } from './parking-spot.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Foydalanuvchi UUID',
  })
  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;


  @Column({
    name: 'spot_id',
    type: 'uuid',
  })
  spot_id: string;

  @ApiProperty({
    example: 5,
    description: 'Foydalanuvchining bahosi (1 dan 5 gacha)',
    minimum: 1,
    maximum: 5,
  })
  @Column({ name: 'raiting', type: 'int' })
  raiting: number;

  @ApiProperty({
    example: 'Juda yaxshi xizmat ko‘rsatildi!',
    description: 'Foydalanuvchi tomonidan qoldirilgan izoh',
  })
  @Column({ name: 'comment', type: 'text' })
  comment: string;

  @ApiProperty({ type: () => UserEntity, description: 'Izoh qoldirgan foydalanuvchi' })
  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ParkingSpotEntity, (spot) => spot.comments)
  @JoinColumn({ name: 'spot_id' })
  spot: ParkingSpotEntity;
}
