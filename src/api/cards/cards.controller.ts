
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';;
import { UserID } from 'src/common/decorators/userId';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() createCardDto: CreateCardDto,
    @UserID() id: string
  ) {
    return await this.cardsService.create(createCardDto, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of cards' })
  async findAll() {
    return await this.cardsService.findAll();
  }

  @Get('user')
  async findUserCards(@UserID() id: string) {
    return await this.cardsService.findUserCardsById(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single card by ID' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of card' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findOne(@Param('id') id: string) {
    return await this.cardsService.findOne(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update a card by ID' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return await this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async remove(@Param('id') id: string) {
    return await this.cardsService.remove(id);
  }
}
