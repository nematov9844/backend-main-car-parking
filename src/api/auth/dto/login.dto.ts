import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { IsPhoneNumber } from 'src/common/decorators/isPhoneNumber';

export class LoginDto {
  @ApiProperty({
    description: 'The number of the user',
    example: '+998901234567',
  })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongP@ssword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
