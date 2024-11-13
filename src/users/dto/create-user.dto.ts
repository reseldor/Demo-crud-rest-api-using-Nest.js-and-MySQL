import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'full_name be a text' })
  @MaxLength(255)
  @MinLength(3)
  @ApiProperty()
  full_name: string;

  @IsNotEmpty()
  @IsString({ message: 'role must be a text' })
  @MaxLength(255)
  @MinLength(3)
  @ApiProperty()
  role: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(9999999999)
  @Min(0)
  @ApiProperty()
  efficiency: number;

}
