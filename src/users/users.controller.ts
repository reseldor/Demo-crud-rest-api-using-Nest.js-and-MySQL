import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Patch,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GenericResponseDto } from './dto/generic-response.dto';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(@Query('role') role?: string):  Promise<GenericResponseDto<{ users: UserResponseDto[] }>> {
    const users = await this.usersService.getAll(role);
    return {
      success: true,
      result: { users },
    };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<GenericResponseDto<{ users: UserResponseDto[] }>> {
    const user = await this.usersService.getOneById(id);
    return {
      success: true,
      result: { users: user ? [user] : [] },
    };
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<{
    success: boolean,
    result?: number,
  }> {
    const result = await this.usersService.create(user);
    if (result) {
      return {
        success: true,
        result: result.id,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<GenericResponseDto<UserResponseDto>> {
    const updatedUser = await this.usersService.update(id, user);
    return {
      success: true,
      result: updatedUser,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<GenericResponseDto<UserResponseDto>> {
    const deletedUser = await this.usersService.delete(id);
    return {
      success: true,
      result: deletedUser ? deletedUser[0] : undefined,
    };
  }

  @Delete()
  async deleteAllUsers(): Promise<GenericResponseDto<void>> {
    await this.usersService.delete();
    return {
      success: true,
    };
  }
}

