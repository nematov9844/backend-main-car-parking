import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../database/Enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // Agar ro‘yxat bo‘lmasa, har qanday foydalanuvchi kirishi mumkin
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user; // request userdan olamiz

    return requiredRoles.includes(user.role); // agar ro‘yxatdagi ro‘l bo‘lsa, ruxsat beriladi
  }
}
