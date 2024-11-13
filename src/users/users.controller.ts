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
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('Users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get()
  async GetAll(): Promise<User[]> {
    return this.UsersService.getAll();
  }

  @Get(':id')
  async GetOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.UsersService.getOneById(id);
  }

  @Post()
  async create(@Body() User: CreateUserDto): Promise<User> {
    return this.UsersService.create(User);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() User: UpdateUserDto,
  ): Promise<User> {
    return this.UsersService.update(id, User);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return this.UsersService.delete(id);
  }
}
