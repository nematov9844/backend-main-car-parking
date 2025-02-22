import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserID } from 'src/common/decorators/userId';
import { ForgetDto } from './dto/forget.dto';
import { ChangeDto } from './dto/change.dto';
import { Public } from 'src/common/decorators/public';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @ApiOperation({ summary: 'Login a user and get tokens' })
  @ApiResponse({
    status: 200,
    description:
      'User logged in successfully, returns access and refresh tokens',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);

  } 

  @Public()
  @ApiOperation({ summary: 'Send password reset link to email' })
  @ApiResponse({ status: 200, description: 'Link sent successfully' })
  @ApiResponse({ status: 400, description: 'User not found' })
  @Post('forget-password')
  async forgetPassword(@Body() dto: ForgetDto) {
    return await this.authService.forgetPassword(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiParam({ name: 'token', required: true, description: 'Reset token' })
  @Post('change-password/:token')
  async changePassword(@Param('token') token: string, @Body() dto: ChangeDto) {
    return await this.authService.changePassword(token, dto);
  }

  @ApiOperation({ summary: 'Reset password while logged in' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('reset-password')
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @UserID() id: string,
  ) {
    return await this.authService.resetPassword(resetDto, id);
  }

  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('refresh')
  async refreshTokens(@Body() dto: RefreshDto) {
    return await this.authService.refreshTokens(dto);
  }
}
