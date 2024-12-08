import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateActionUser } from './dtos/create-action.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('ban')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async banUser(@Body() data: CreateActionUser) {
    await this.userService.bannedUser(data);
    return { message: `User with ID ${data.userId} has been banned.` };
  }

  @Post('unlock/:userId')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async unlockUser(@Param('userId', ParseIntPipe) userId: number) {
    await this.userService.unlockUser(userId);
    return { message: `User with ID ${userId} has been unlocked.` };
  }

  @Get('/violent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async getViolents() {
    return await this.userService.getUserViolent();
  }
}
