import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { CustomJwtService } from '../../common/jwt/jwt.service';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRoles } from 'src/common/database/Enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: CustomJwtService,
  ) {}

  // Registratsiya qilish
  async register(registerDto: RegisterDto): Promise<any> {
    try {
      const user = await this.userService.createUser({
        ...registerDto,
        role: UserRoles.user,
      });

      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      const refreshToken = await this.jwtService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'User registration failed',
      );
    }
  }

  // Login qilish
  async login(loginDto: LoginDto): Promise<any> {
    const { phone_number, password } = loginDto;

    try {
      const user = await this.userService.findOneByPhoneNumber(phone_number);

      if (!user) {
        throw new BadRequestException('Invalid credentials: User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException(
          'Invalid credentials: Incorrect password',
        );
      }

      // Login'dan so'ng, access va refresh tokenlarni yaratish
      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      const refreshToken = await this.jwtService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      // Agar login xatosi bo'lsa, foydalanuvchiga aniq xato xabarini ko'rsatish
      throw new BadRequestException(error.message || 'Login failed');
    }
  }
}
