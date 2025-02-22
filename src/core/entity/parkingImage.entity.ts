import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { ParkingSpotEntity } from './parking-spot.entity';

@Entity()
export class ParikingImageEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'parking_id' })
  parking_id: string;

  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @ManyToOne(() => ParkingSpotEntity, (parking) => parking.images)
  @JoinColumn({ name: 'parking_id' })
  spot: ParkingSpotEntity;
}
