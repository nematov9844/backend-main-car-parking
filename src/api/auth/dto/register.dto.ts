import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { UserRoles } from 'src/common/database/Enums';
import { IsPhoneNumber } from 'src/common/decorators/isPhoneNumber';

export class RegisterDto {
  @ApiProperty({
    description: "User's full name",
    example: 'Jon Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  full_name: string;

  @ApiProperty({
    description: 'Unique phone_number of the user',
    example: '+998901234567',
  })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    description: 'Unique email for the user',
    example: 'johndoe123@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongP@ssword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password kamida 8 ta belgi, bitta katta harf, bitta kichik harf, bitta raqam va bitta maxsus belgi (@$!%*?&) bo‘lishi kerak',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'USER',
    enum: UserRoles,
  })
  @IsOptional()
  @IsEnum(UserRoles, { message: 'Role faqat USER yoki ADMIN bo‘lishi mumkin' })
  role: UserRoles; // UserRoles enumga asoslangan role maydoni
}
