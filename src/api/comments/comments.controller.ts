import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserID } from 'src/common/decorators/userId';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created.' })
  create(@Body() createCommentDto: CreateCommentDto, @UserID() id: string) {
    return this.commentsService.create(createCommentDto, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comments.' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Get('parkingId')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  findOneBySpotId(@Param('id') id: string) {
    return this.commentsService.findBySpotId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
