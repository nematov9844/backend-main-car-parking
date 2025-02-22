import { IsUUID, IsInt, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  // @ApiProperty({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Foydalanuvchi IDsi',
  // })
  // @IsUUID()
  // user_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Parking IDsi',
  })
  @IsUUID()
  spot_id: string;

  @ApiProperty({
    example: 5,
    description: 'Reyting (1 dan 5 gacha)',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  raiting: number;

  @ApiProperty({
    example: 'Ajoyib xizmat, juda mamnunman!',
    description: 'Izoh matni',
  })
  @IsString()
  comment: string;
}
