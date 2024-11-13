import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async getAll(role?: string): Promise<UserResponseDto[]> {
    let users =  await this.UserRepository.find();
    users = role ? users.filter(user => user.role === role) : users;
    return users;
  }

  async getOneById(id: number): Promise<UserResponseDto | undefined> {
      return await this.UserRepository.findOne({
        where: { id: id },
      });
  }

  async create(User: CreateUserDto): Promise<User> {
    const createdUser = this.UserRepository.create(User);
    return await this.UserRepository.save(createdUser);
  }

  async update(id: number, User: UpdateUserDto):Promise<UserResponseDto> {
    let foundUser = await this.UserRepository.findOneBy({
      id: id,
    });

    foundUser = { ...foundUser, ...User, updated_at: new Date() };
    return await this.UserRepository.save(foundUser);
  }

  async delete(id?: number): Promise<UserResponseDto | undefined> {
    if(id) {
      let foundUser = await this.UserRepository.findOneBy({
        id: id,
      });
      await this.UserRepository.delete(id);
      return foundUser;
    } else {
      await this.UserRepository.clear()
      return undefined;
    }
  }
}
