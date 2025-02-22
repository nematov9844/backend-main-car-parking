import { IsUUID, IsInt, IsString, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Foydalanuvchi IDsi (ixtiyoriy)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Band qilish IDsi (ixtiyoriy)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reservation_id?: string;

  @ApiProperty({
    example: 5,
    description: 'Reyting (1 dan 5 gacha, ixtiyoriy)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  raiting?: number;

  @ApiProperty({
    example: 'Ajoyib xizmat, juda mamnunman!',
    description: 'Izoh matni (ixtiyoriy)',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
