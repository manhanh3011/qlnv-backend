import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Connection, Channel } from 'amqplib';
import * as amqp from 'amqplib';
import { RABBITMQ_URL, SCAN_RAW_QUEUE } from './rabbit.constant';

@Injectable()
export class RabbitService implements OnModuleDestroy {
  private connection!: Connection;
  private channel!: Channel;

  async connect() {
    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(SCAN_RAW_QUEUE, {
      durable: true,
    });

    console.log('RabbitMQ Connected');
  }

  getChannel() {
    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
