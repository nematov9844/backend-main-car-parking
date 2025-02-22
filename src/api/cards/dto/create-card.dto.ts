import {
  IsUUID,
  IsDecimal,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {

  @ApiProperty({
    example: 100.5,
    description: 'Kartadagi pul miqdori',
  })
  @IsNumber()
  @IsNotEmpty()
  money: number;

  @ApiProperty({
    example: '1234567890123456',
    description: 'Karta raqami',
  })
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Karta egasining ismi',
  })
  @IsString()
  @IsNotEmpty()
  card_holder_name: string;

  @ApiProperty({
    example: '12/25',
    description: 'Kartaning amal qilish muddati',
  })
  @IsString()
  @IsNotEmpty()
  expiration_date: string;
}
