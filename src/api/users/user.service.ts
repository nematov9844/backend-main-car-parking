import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../../core/entity/user.entity';
import { BcryptService } from 'src/common/bcrypt/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly bcryptService: BcryptService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await this.bcryptService.encrypt(
      createUserDto.password,
    );
    return await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
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

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // Update user
  async updateUser(id: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    if (updateDto.password) {
      updateDto.password = await this.bcryptService.encrypt(updateDto.password);
    }
    await this.userRepository.update(id, updateDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  // Delete user
  async removeUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async checkByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return true;
    }
    return false;
  }

  async checkByPhoneNumber(phone_number: string) {
    const user = await this.userRepository.findOneBy({ phone_number });
    if (user) {
      return true;
    }
    return false;
  }
}
