import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersCron } from './user.cron';
import { ProducerModule } from 'src/producer/producer.module';

@Module({
  imports: [ProducerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
