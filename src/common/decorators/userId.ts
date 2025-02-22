import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

export const UserID = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Token not found');
    }
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorizated');
    }
    try {
      const jwtService = new JwtService({
        secret: config.ACCESS_TOKEN_SECRET_KEY,
      });
      const decoded = await jwtService.verifyAsync(token)
      return decoded['id'];
    } catch (error) {
      throw new BadRequestException('Invalid token' + error.message);
    }
  },
);
