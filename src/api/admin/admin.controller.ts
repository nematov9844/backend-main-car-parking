import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserRoles } from 'src/common/database/Enums';
import { Roles } from 'src/common/decorators/roles.decorators';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(UserRoles.superAdmin)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin successfully created' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Email or Phone number already exists',
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @Roles(UserRoles.superAdmin)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.superAdmin)
  @ApiOperation({ summary: 'Get a single admin by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin found successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoles.superAdmin)
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @Roles(UserRoles.superAdmin)
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
