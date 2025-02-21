import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: { id: string; role: string }; // `user` obyektining strukturasini to‘g‘ri ko‘rsating
  }
}
