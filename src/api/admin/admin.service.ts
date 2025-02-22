import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UserService } from '../users/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/common/database/Enums';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async create(dto: CreateAdminDto) {
    const { email, phone_number } = dto;
    const [exitingNumber, exitingEmail] = await Promise.all([
      this.userService.checkByEmail(email),
      this.userService.checkByPhoneNumber(phone_number),
    ]);
    if (exitingNumber) {
      throw new ConflictException('Phone number already exists');
    }
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }
    dto.role = UserRoles.admin;
    const admin = await this.userService.createUser(dto);
    delete admin.password;
    return {
      message: 'Created',
      status: 201,
      data: admin,
    };
  }

  async findAll() {
    const admins = await this.userRepository.find({
      where: { role: UserRoles.admin },
    });
    return {
      message: 'Success',
      status: 200,
      data: admins,
    };
  }

  async findOne(id: string) {
    const admin = await this.userRepository.findOneBy({
      role: UserRoles.admin,
      id,
    });
    if (!admin) {
      throw new NotFoundException(`Admin not found with ${id} id`);
    }
    delete admin.password;
    return {
      message: 'Success',
      status: 200,
      data: admin,
    };
  }

  async update(id: string, dto: UpdateAdminDto) {
    const admin = await this.userRepository.findOneBy({
      role: UserRoles.admin,
      id,
    });
    if (!admin) {
      throw new NotFoundException(`Admin not found with ${id} id`);
    }
    dto.role = UserRoles.admin;
    await this.userService.updateUser(id, dto);
    return {
      message: 'Updated',
      status: 200,
      data: { id },
    };
  }

  async remove(id: string) {
    const admin = await this.userRepository.findOneBy({
      role: UserRoles.admin,
      id,
    });
    if (!admin) {
      throw new NotFoundException(`Admin not found with ${id} id`);
    }
    await this.userRepository.delete(id);
    return {
      message: 'Deleted',
      status: 200,
      data: { id },
    };
  }
}
