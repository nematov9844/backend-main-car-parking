import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongP@ssword123',
  })
  @IsStrongPassword()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
