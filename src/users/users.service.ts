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
    if (role) {
      users = role ? users.filter(user => user.role === role) : users;
    }
    return users;
  }

  async getOneById(id: number): Promise<UserResponseDto | undefined> {
      return await this.UserRepository.findOne({
        where: { id: id },
      });
  }

  async create(user: CreateUserDto): Promise<User | undefined> {
    let existName = await this.UserRepository.findOneBy({
      full_name: user.full_name,
    });
    if (existName) {
      return undefined;
    }
    const createdUser = this.UserRepository.create(user);
    return await this.UserRepository.save(createdUser);
  }

  async update(id: number, user: UpdateUserDto):Promise<UserResponseDto | undefined> {
    let foundUser = await this.UserRepository.findOneBy({
      id: id,
    });
    let existName = await this.UserRepository.findOneBy({
      full_name: user.full_name,
    });
    if (existName) {
      return undefined;
    }
    foundUser = { ...foundUser, ...user, updated_at: new Date() };
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
