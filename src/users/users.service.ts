import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.UserRepository.find();
  }

  async getOneById(id: number): Promise<User> {
    try {
      return await this.UserRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (err) {
      console.log('Get one User by id error: ', err.message ?? err);
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(User: CreateUserDto): Promise<User> {
    const createdUser = this.UserRepository.create(User);
    return await this.UserRepository.save(createdUser);
  }

  async update(id: number, User: UpdateUserDto): Promise<User> {
    let foundUser = await this.UserRepository.findOneBy({
      id: id,
    });

    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    foundUser = { ...foundUser, ...User, updated_at: new Date() };
    return await this.UserRepository.save(foundUser);
  }

  async delete(id: number): Promise<number> {
    let foundUser = await this.UserRepository.findOneBy({
      id: id,
    });

    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.UserRepository.delete(id);
    return foundUser.id;
  }
}
