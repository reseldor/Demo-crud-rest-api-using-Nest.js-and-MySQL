import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './index';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
