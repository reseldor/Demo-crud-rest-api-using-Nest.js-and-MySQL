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

  async getAll(
    role?: string,
    fullName?: string,
    efficiency?: number,
  ): Promise<UserResponseDto[]> {
    const query = this.UserRepository.createQueryBuilder('user');
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    if (fullName) {
      query.andWhere('user.full_name = :fullName', { fullName });
    }
    if (efficiency !== undefined) {
      query.andWhere('user.efficiency = :efficiency', { efficiency });
    }
    const users = await query.getMany();
    return users;
  }

  async getOneById(id: number): Promise<UserResponseDto | undefined> {
    return await this.UserRepository.findOne({
      where: { id: id },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existName = await this.UserRepository.findOneBy({
      full_name: user.full_name,
    });
    if (existName) {
      throw new HttpException(
        {
          success: false,
          result: { error: 'user with this full_name already exist' },
        },
        HttpStatus.CONFLICT,
      );
    }
    const createdUser = this.UserRepository.create(user);
    return await this.UserRepository.save(createdUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    let foundUser = await this.UserRepository.findOneBy({
      id: id,
    });
    const existName = await this.UserRepository.findOneBy({
      full_name: user.full_name,
    });
    if (existName) {
      throw new HttpException(
        {
          success: false,
          result: { error: 'user with this full_name already exist' },
        },
        HttpStatus.CONFLICT,
      );
    }
    foundUser = { ...foundUser, ...user, updated_at: new Date() };
    return await this.UserRepository.save(foundUser);
  }

  async delete(id?: number): Promise<UserResponseDto> {
    if (id) {
      const foundUser = await this.UserRepository.findOneBy({
        id: id,
      });
      if (!foundUser) {
        throw new HttpException(
          {
            success: false,
            result: { error: 'user with this id not found' },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      await this.UserRepository.delete(id);
      return foundUser;
    } else {
      await this.UserRepository.clear();
    }
  }
}
