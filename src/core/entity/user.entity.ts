import { BaseEntity } from 'src/common/database/BaseEntity';
import { UserRoles } from 'src/common/database/Enums';
import { Column, Entity } from 'typeorm';

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
}
