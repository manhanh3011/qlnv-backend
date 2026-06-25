import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersCron } from './user.cron';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCron],
})
export class UsersModule {}
