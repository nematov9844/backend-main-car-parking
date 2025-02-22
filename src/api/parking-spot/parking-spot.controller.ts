import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Patch,
  Query,
  UseInterceptors,
  UsePipes,
  UploadedFile,
} from '@nestjs/common';
import { ParkingSpotService } from './parking-spot.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ParkingSpotEntity } from 'src/core/entity/parking-spot.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/pipe/image';
import { Public } from 'src/common/decorators/public';

@ApiTags('Parking Spots')
@ApiBearerAuth()
@Controller('parking-spots')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Post()
  @ApiOperation({
    summary: 'Yangi parking joy qo‘shish',
    description: 'Yangi parking joy yaratadi',
  })
  @ApiBody({
    type: CreateParkingSpotDto,
    description: 'Parking joy ma’lumotlari',
  })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli yaratildi',
    type: ParkingSpotEntity,
  })
  @ApiResponse({ status: 400, description: 'Xato: Noto‘g‘ri ma’lumotlar' })
  create(@Body() dto: CreateParkingSpotDto) {
    return this.parkingSpotService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Barcha parking joylarni olish',
    description: 'Barcha mavjud parking joylarini qaytaradi',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: [ParkingSpotEntity],
  })
  findAll() {
    return this.parkingSpotService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ID bo‘yicha parking joyni olish',
    description: 'Berilgan ID bo‘yicha parking joy topiladi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Parking joy ID-si' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: ParkingSpotEntity,
  })
  @ApiResponse({ status: 404, description: 'Xato: Parking joy topilmadi' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parkingSpotService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Parking joyni yangilash',
    description: 'Berilgan ID bo‘yicha parking joy ma’lumotlarini yangilaydi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Parking joy ID-si' })
  @ApiBody({
    type: UpdateParkingSpotDto,
    description: 'Yangilangan parking joy ma’lumotlari',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli yangilandi',
    type: ParkingSpotEntity,
  })
  @ApiResponse({ status: 400, description: 'Xato: Noto‘g‘ri ma’lumotlar' })
  @ApiResponse({ status: 404, description: 'Xato: Parking joy topilmadi' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParkingSpotDto,
  ) {
    return this.parkingSpotService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Parking joyni o‘chirish',
    description: 'Berilgan ID bo‘yicha parking joyni o‘chiradi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Parking joy ID-si' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Xato: Parking joy topilmadi' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.parkingSpotService.remove(id);
  }


  @Get()
  @ApiOperation({ summary: 'Barcha parking joylarini olish' })
  @ApiResponse({ status: 200, description: 'Barcha parking joylari olindi.' })
  async getAllAvailableSpots() {
    return this.parkingSpotService.getAllAvailableSpots();
  }


  @Get(':parkingId')
  @ApiOperation({ summary: 'Bitta parking joyini olish' })
  @ApiParam({ name: 'parkingId', description: 'Parking ID' })
  @ApiResponse({ status: 200, description: 'Parking joyi olindi.' })
  async getAvailableSpots(@Param('parkingId') parkingId: string) {
    return this.parkingSpotService.getAvailableSpots(parkingId);
  }


  @Patch(':parkingId')
  @ApiOperation({ summary: 'Parking joylarini yangilash (Admin)' })
  @ApiParam({ name: 'parkingId', description: 'Parking ID' })
  @ApiQuery({
    name: 'bSpots',
    description: 'Boshqa joylar soni',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'cSpots',
    description: 'Yopiq joylar soni',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Parking joylari yangilandi.' })
  async updateAvailableSpots(
    @Param('parkingId') parkingId: string,
    @Query('bSpots') bSpots: number,
    @Query('cSpots') cSpots: number,
  ) {
    await this.parkingSpotService.updateAvailableSpots(
      parkingId,
      bSpots,
      cSpots,
    );
    return { message: 'Parking joylari yangilandi' };
  }

  @ApiOperation({ summary: 'Upload an image for a parking spot' })
  @ApiParam({ name: 'id', required: true, description: 'Parking spot ID' })
  @ApiConsumes('multipart/form-data')
  @Post('upload/:id')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ImageValidationPipe)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return await this.parkingSpotService.upload(file, id);
  }

  @ApiOperation({ summary: 'Delete an uploaded parking spot image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: { type: 'string', example: 'image.png' },
      },
    },
  })
  @Post('delete-image')
  @Public()
  async deleteImage(@Body('fileName') fileName: string) {
    return await this.parkingSpotService.deleteImage(fileName);
  }
}
