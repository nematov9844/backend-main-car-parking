import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEmail, ValidateIf, Validate, isPhoneNumber } from 'class-validator';
import { IsPhoneNumber } from 'src/common/decorators/isPhoneNumber';


export class LoginDto {
  @ApiProperty({
    description: 'The number of the user or email',
    example: '+998901234567',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.login && o.login.includes('@'))
  @IsEmail({}, { message: 'Invalid email format' })
  @ValidateIf((o) => o.login && !o.login.includes('@'))
  @Validate((value) => isPhoneNumber(value, 'UZ'), {
    message: 'Invalid phone number format',
  })
  login: string;


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
