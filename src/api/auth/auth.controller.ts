import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth') // Swaggerda 'auth' nomli kategoriya yaratish
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registratsiya qilish
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Endpointning qisqacha izohi
  @ApiResponse({ status: 201, description: 'User registered successfully' }) // Muvoffaqiyatli natija
  @ApiResponse({ status: 400, description: 'Bad Request' }) // Xatolik
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // Login qilish
  @Post('login')
  @ApiOperation({ summary: 'Login a user and get tokens' }) // Endpointning qisqacha izohi
  @ApiResponse({
    status: 200,
    description:
      'User logged in successfully, returns access and refresh tokens',
  }) // Muvoffaqiyatli natija
  @ApiResponse({ status: 400, description: 'Invalid credentials' }) // Xatolik
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
