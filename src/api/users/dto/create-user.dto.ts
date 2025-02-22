import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsEmail,
  Matches,
} from 'class-validator';
import { UserRoles } from 'src/common/database/Enums';
import { IsPhoneNumber } from 'src/common/decorators/isPhoneNumber';

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name",
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  full_name: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe123',
  })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongP@ssword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Parolda kamida bitta katta harf, bitta raqam va bitta maxsus belgi (@$!%*?&) bo‘lishi kerak',
  })
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'USER',
    enum: UserRoles,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles; // UserRoles enumga asoslangan role maydoni
}
