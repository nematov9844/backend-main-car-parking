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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentEntity } from 'src/core/entity/payment.entity';
import { UserID } from 'src/common/decorators/userId';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    summary: 'Yangi to‘lov qo‘shish',
    description: 'Yangi to‘lovni yaratadi',
  })
  @ApiBody({ type: CreatePaymentDto, description: 'To‘lov ma’lumotlari' })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli yaratildi',
    type: PaymentEntity,
  })
  @ApiResponse({ status: 400, description: 'Xato: Noto‘g‘ri ma’lumotlar' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Barcha to‘lovlarni olish',
    description: 'Barcha mavjud to‘lovlarni qaytaradi',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: [PaymentEntity],
  })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('user')
  @ApiOperation({
    summary: 'Barcha to‘lovlarni olish',
    description: 'Barcha mavjud to‘lovlarni qaytaradi',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: [PaymentEntity],
  })
  findAllWithUserId(@UserID() id: string) {
    return this.paymentService.findAllWithUserId(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ID bo‘yicha to‘lovni olish',
    description: 'Berilgan ID bo‘yicha to‘lov topiladi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'To‘lov ID-si' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli',
    type: PaymentEntity,
  })
  @ApiResponse({ status: 404, description: 'Xato: To‘lov topilmadi' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'To‘lovni yangilash',
    description: 'Berilgan ID bo‘yicha to‘lov ma’lumotlarini yangilaydi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'To‘lov ID-si' })
  @ApiBody({
    type: UpdatePaymentDto,
    description: 'Yangilangan to‘lov ma’lumotlari',
  })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli yangilandi',
    type: PaymentEntity,
  })
  @ApiResponse({ status: 400, description: 'Xato: Noto‘g‘ri ma’lumotlar' })
  @ApiResponse({ status: 404, description: 'Xato: To‘lov topilmadi' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'To‘lovni o‘chirish',
    description: 'Berilgan ID bo‘yicha to‘lovni o‘chiradi',
  })
  @ApiParam({ name: 'id', example: 1, description: 'To‘lov ID-si' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Xato: To‘lov topilmadi' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.remove(id);
  }
}
