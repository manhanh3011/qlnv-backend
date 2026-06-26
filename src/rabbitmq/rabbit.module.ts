import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitConsumer } from './rabbit.consumer';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [RabbitService, RabbitConsumer],
  exports: [RabbitService],
})
export class RabbitModule {}