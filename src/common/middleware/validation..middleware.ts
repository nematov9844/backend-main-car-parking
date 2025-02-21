import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestException(
        'So‘rov tanasi (body) bo‘sh bo‘lishi mumkin emas',
      );
    }
    next();
  }
}
