import { Entity, Column, OneToMany } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { CommentEntity } from './comment.entity';
import { ParikingImageEntity } from './parkingImage.entity';

@Entity()
export class ParkingSpotEntity extends BaseEntity {
  @Column()
  location_name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column()
  b_total_spots: number;

  @Column()
  c_total_spots: number;

  @Column()
  b_available_spots: number;

  @Column()
  c_available_spots: number;

  @Column({ type: 'enum', enum: ['open', 'close'] })
  parking_type: string;

  @Column()
  cost: number;

  @Column()
  admin_id: string;

  // Relations
  @OneToMany(() => ReservationEntity, (reservation) => reservation.spot)
  reservations: ReservationEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.spot)
  comments: CommentEntity[];

  @OneToMany(() => ParikingImageEntity, (image) => image.spot)
  images: ParikingImageEntity[];
}
