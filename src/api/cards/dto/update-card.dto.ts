import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsUUID } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Foydalanuvchi IDsi',
  })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    example: 100.5,
    description: 'Kartadagi pul miqdori',
  })
  @IsDecimal()
  @IsOptional()
  money?: number;

  @ApiProperty({
    example: '1234567890123456',
    description: 'Karta raqami',
  })
  @IsOptional()
  card_number?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Karta egasining ismi',
  })
  @IsOptional()
  card_holder_name?: string;

  @ApiProperty({
    example: '12/25',
    description: 'Kartaning amal qilish muddati',
  })
  @IsOptional()
  expiration_date?: string;
}
