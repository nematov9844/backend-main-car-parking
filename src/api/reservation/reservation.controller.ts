import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationEntity } from 'src/core/entity/reservation.entity';
import { UserID } from 'src/common/decorators/userId';
import { UUID } from 'crypto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  @ApiOperation({ summary: 'Yangi rezervatsiya yaratish' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Rezervatsiya yaratildi',
    type: ReservationEntity,
  })
  create(
    @Body() dto: CreateReservationDto,
    @UserID() id: UUID
  ) {
    return this.reservationService.create(dto, id);
  }


  @Get()
  @ApiOperation({ summary: 'Barcha rezervatsiyalarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: [ReservationEntity],
  })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rezervatsiyani ID bo‘yicha olish' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: ReservationEntity })
  @ApiResponse({ status: 404, description: 'Rezervatsiya topilmadi' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.findOne(id);
  }

  @Get('user')
  @ApiOperation({ summary: 'User ID bo‘yicha olish' })
  @ApiResponse({ status: 200, type: ReservationEntity })
  @ApiResponse({ status: 404, description: 'Rezervatsiya topilmadi' })
  findOneByUserId(@UserID(new ParseUUIDPipe()) id: UUID) {
    console.log(id)
    return this.reservationService.findOneByUserId(id);
  }



  @Put(':id')
  @ApiOperation({ summary: 'Rezervatsiyani yangilash' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateReservationDto })
  @ApiResponse({
    status: 200,
    description: 'Yangilandi',
    type: ReservationEntity,
  })
  @ApiResponse({ status: 404, description: 'Rezervatsiya topilmadi' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rezervatsiyani o‘chirish' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'O‘chirildi' })
  @ApiResponse({ status: 404, description: 'Rezervatsiya topilmadi' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.remove(id);
  }
}
