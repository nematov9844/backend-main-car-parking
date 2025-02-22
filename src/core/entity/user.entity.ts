import { BaseEntity } from 'src/common/database/BaseEntity';
import { UserRoles } from 'src/common/database/Enums';
import { Column, Entity, OneToMany } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { CardEntity } from './card.entity';
import { CommentEntity } from './comment.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'full_name',
    type: 'varchar',
  })
  full_name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    unique: true,
  })
  phone_number: string;

  @Column({
    name: 'password',
    type: 'varchar',
    default: Date.now(),
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.user,
  })
  role: UserRoles;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations: ReservationEntity[];

  @OneToMany(() => CardEntity, (card) => card.user)
  cards: CardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
