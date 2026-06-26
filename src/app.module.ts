import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitModule } from './rabbitmq/rabbit.module';

@Module({
  imports: [UsersModule, RabbitModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
