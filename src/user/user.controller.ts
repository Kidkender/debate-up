import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ROLE } from 'src/common/enumerations/role.enum';
import { CreateActionUser } from './dtos/create-action.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getUsers() {
    const users = await this.userService.getUsers();
    return plainToInstance(UserResponseDto, users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Post('ban')
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Ban a user (Admin only)' })
  async banUser(@Body() data: CreateActionUser) {
    await this.userService.bannedUser(data);
    return { message: `User with ID ${data.userId} has been banned.` };
  }

  @Post('unlock/:userId')
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Unlock a user (Admin only)' })
  async unlockUser(@Param('userId', ParseIntPipe) userId: number) {
    await this.userService.unlockUser(userId);
    return { message: `User with ID ${userId} has been unlocked.` };
  }

  @Get('/violent')
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Get violent users (Admin only)' })
  async getViolents() {
    const violentUsers = await this.userService.getUserViolent();
    return plainToInstance(UserResponseDto, violentUsers);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return plainToInstance(UserResponseDto, updatedUser);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user avatar' })
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.userService.updateAvatar(id, file);
    return plainToInstance(UserResponseDto, updatedUser);
  }
}
