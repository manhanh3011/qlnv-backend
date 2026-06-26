import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitService } from "./rabbit.service";
import { SCAN_RAW_QUEUE } from "./rabbit.constant";
import { ConsumeMessage } from "amqplib";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RabbitConsumer implements OnModuleInit{
    constructor(
        private readonly rabbitService: RabbitService,
        private readonly userService: UsersService,
    ) { }
    
    async onModuleInit() {
        await this.rabbitService.connect();
        const channel = await this.rabbitService.getChannel();
        channel.consume(SCAN_RAW_QUEUE,
            async (msg: ConsumeMessage | null) => {
                if (!msg) return;
                try {
                    const payload = JSON.parse(msg.content.toString());
                    console.log("Received:", payload);
                    switch (payload.key) {
                        case "SCAN_RAW_EMPLOYEE": await this.userService.processPendingImportUsers();
                            break;
                        default: console.log("unknow key")
                    }
                    channel.ack(msg);
                } catch (error) {
                    console.error(error);
                    channel.nack(msg, false, true);
                }
            }
        );
        console.log("Waiting for messages...");
    }
}