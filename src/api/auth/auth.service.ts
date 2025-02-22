import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { TokenService } from 'src/common/jwt/jwt.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt';
import { UserRoles } from 'src/common/database/Enums';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ForgetDto } from './dto/forget.dto';
import { MailService } from 'src/common/mailer/mailer.service';
import { ChangeDto } from './dto/change.dto';
import { RefreshDto } from './dto/refresh.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: TokenService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailService,
  ) { }

  async register(registerDto: RegisterDto): Promise<any> {
    const { phone_number, email } = registerDto;
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
    registerDto.role = UserRoles.user;
    const user = await this.userService.createUser(registerDto);
    delete user.password;
    return {
      message: 'Created',
      status: 201,
      data: user,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { login, password } = loginDto;
    // Foydalanuvchini telefon raqam yoki email orqali topish
    const user = await this.userService.findOneByPhoneNumber(login)
      || await this.userService.findOneByEmail(login);

    if (!user) {
      throw new NotFoundException('User with this login not found');
    }

    const matchPassword = await this.bcryptService.compare(password, user.password);
    if (!matchPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.createAccessToken(payload);
    const refreshToken = this.jwtService.createRefreshToken(payload);

    return {
      message: 'Logged in',
      status: 200,
      data: { accessToken, refreshToken },
    };
  }


  async forgetPassword(dto: ForgetDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(`User not found with ${dto.email} email`);
    }
    const token = this.jwtService.createAccessToken({ id: user.id });
    await this.mailerService.sendPasswordReset(dto.email, token);
    return { message: 'Sent link to email', status: 200, data: {} };
  }

  async changePassword(token: string, dto: ChangeDto) {
    const decode = await this.jwtService.verifyAccessToken(token);
    const hashedPassword = await this.bcryptService.encrypt(dto.password);
    dto.password = hashedPassword;
    await this.userService.updateUser(decode.id, dto);
    return { message: 'Updated', status: 200, data: {} };
  }

  async resetPassword(dto: ResetPasswordDto, id: string) {
    const user = await this.userService.findOneUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await this.bcryptService.encrypt(dto.password);
    dto.password = hashedPassword;
    await this.userService.updateUser(id, dto);
    return { message: 'Updated', status: 200, data: {} };
  }

  async refreshTokens(dto: RefreshDto) {
    const decode = await this.jwtService.verifyRefreshToken(dto.refreshToken);
    const user = await this.userService.findOneUser(decode.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.createAccessToken(payload);
    return {
      message: 'Success',
      status: 200,
      data: { accessToken },
    };
  }
}
