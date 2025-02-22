import { IsStrongPassword, MaxLength } from 'class-validator';

export class ChangeDto {
  @IsStrongPassword()
  @MaxLength(32)
  password: string;
}
