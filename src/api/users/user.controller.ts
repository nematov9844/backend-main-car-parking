import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../../core/entity/user.entity';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRoles } from 'src/common/database/Enums';
import { RolesGuard } from 'src/common/guards/role.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Create user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Roles(UserRoles.admin, UserRoles.user) // faqat adminlar yaratishi mumkin
  @UseGuards(RolesGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserEntity],
  })
  @Roles(UserRoles.admin, UserRoles.user) // faqat adminlar ro‘yxatni ko‘rishi mumkin
  @UseGuards(RolesGuard)
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAllUsers();
  }

  // Get user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRoles.admin, UserRoles.user)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneUser(id);
  }

  // Update user
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRoles.admin, UserRoles.user)
  @UseGuards(RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete user
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRoles.admin, UserRoles.user) // faqat adminlar o‘chirishlari mumkin
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.removeUser(id);
  }
}
