import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CarTypes } from 'src/common/database/Enums';

export class CreateReservationDto {
  @ApiProperty({
    example: '2025-02-18T10:00:00Z',
    description: 'Rezervatsiya boshlanish vaqti',
  })
  @IsDateString()
  start_time: Date;

  @ApiProperty({
    example: '2025-02-18T12:00:00Z',
    description: 'Rezervatsiya tugash vaqti',
  })
  @IsDateString()
  end_time: Date;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'completed', 'cancelled'],
    description: 'Rezervatsiya statusi',
  })
  @IsEnum(['active', 'completed', 'cancelled'])
  status: string;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID-si' })
  @IsString()
  @IsOptional()
  user_id: string;

  @ApiProperty({ example: 2, description: 'Avtoturargoh ID-si' })
  @IsString()
  spot_id: string;

  @ApiProperty({ example: 'B', description: 'Mashina turi', enum: CarTypes })
  @IsNotEmpty()
  @IsEnum(CarTypes)
  car_type: CarTypes
}
