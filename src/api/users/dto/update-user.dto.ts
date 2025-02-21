import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: "User's first name (optional)",
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name?: string;

  @ApiProperty({
    description: "User's last name (optional)",
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  surname?: string;

  @ApiProperty({
    description: 'Unique username for the user (optional)',
    example: 'johndoe123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username faqat harflar, raqamlar va pastki chiziq (_) dan iborat bo‘lishi kerak',
  })
  username?: string;

  @ApiProperty({
    description: 'Password for the user account (optional)',
    example: 'UpdatedP@ssword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Parolda kamida bitta katta harf, bitta raqam va bitta maxsus belgi (@$!%*?&) bo‘lishi kerak',
  })
  password?: string;
}
