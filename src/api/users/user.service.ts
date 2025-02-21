import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../../core/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Create user
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    //Parolni hach qilish
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  // Get all users
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  // Get user by ID
  async findOneUser(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByPhoneNumber(phone_number: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { phone_number } });
  }

  // Update user
  async updateUser(id: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    let hashPassword: string | null = null;
    if (updateDto.password) {
      hashPassword = await bcrypt.hash(updateDto.password, 10);
    }
    if (hashPassword) {
      updateDto.password = hashPassword;
    }
    this.userRepository.update(id, updateDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  // Delete user
  async removeUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
