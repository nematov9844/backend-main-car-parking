import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, IsUUID, IsNumberString } from 'class-validator';

export class CreateParkingSpotDto {
  @ApiProperty({
    example: 'Downtown Parking',
    description: 'Parking joyining nomi',
  })
  @IsString()
  location_name: string;

  @ApiProperty({ example: '123 Main Street', description: 'Manzil' })
  @IsString()
  address: string;

  @ApiProperty({ example: 69.2401, description: 'Uzoqlik bo\'yicha uzunlik' })
  @IsNumber()
  longitude: number;
  
  @ApiProperty({ example: 41.2995, description: 'Uzoqlik bo\'yicha kenglik' })
  @IsNumber() 
  latitude: number;
  


  @ApiProperty({ example: 50, description: 'B toifali joylar soni' })
  @IsNumber()
  @Min(0)
  b_total_spots: number;

  @ApiProperty({ example: 30, description: 'C toifali joylar soni' })
  @IsNumber()
  @Min(0)
  c_total_spots: number;

  @ApiProperty({ example: 10, description: 'B toifali bo‘sh joylar' })
  @IsNumber()
  @Min(0)
  b_available_spots: number;

  @ApiProperty({ example: 5, description: 'C toifali bo‘sh joylar' })
  @IsNumber()
  @Min(0)
  c_available_spots: number;

  @ApiProperty({
    example: 'open',
    enum: ['open', 'close'],
    description: 'Parkovka turi',
  })
  @IsEnum(['open', 'close'])
  parking_type: string;

  @ApiProperty({ example: 10, description: 'Narxi (so‘m yoki dollar)' })
  @IsNumber()
  @Min(0)
  cost: number;


  @ApiProperty({ example: 1, description: 'Admin ID-si' })
  @IsUUID()
  admin_id: string;
}
