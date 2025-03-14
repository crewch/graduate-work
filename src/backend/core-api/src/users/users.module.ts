import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
