import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { UUID } from 'crypto';

export class CreatePaymentDto {
  @ApiProperty({
    example: 100.5,
    description: 'To‘lov miqdori (so‘m yoki dollar)',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'card',
    enum: ['card', 'cash', 'mobile'],
    description: 'To‘lov usuli',
  })
  @IsEnum(['card', 'cash', 'mobile'])
  payment_method: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'completed', 'failed'],
    description: 'To‘lov holati',
  })
  @IsEnum(['pending', 'completed', 'failed'])
  payment_status: string;

  @ApiProperty({
    example: 'txn_123456',
    description: 'Tranzaksiya ID-si',
    required: false,
  })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({
    example: '37663b75-d628-4729-8be9-41a98a4ce19f',
    description: 'Card ID-si',
    required: false,
  })
  @IsString()
  @IsOptional()
  card_id?: string;


  @ApiProperty({ example: 1, description: 'Rezervatsiya ID-si' })
  @IsString()
  reservation_id: UUID;
}
