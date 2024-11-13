import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConnectionConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    envModule,
    TypeOrmModule.forRoot(TypeOrmConnectionConfig),
    UsersModule,
  ],
})
export class AppModule {}
