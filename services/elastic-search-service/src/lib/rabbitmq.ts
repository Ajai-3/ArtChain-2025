import amqp, { Connection, Channel } from "amqplib";
import { config } from "../config/env";

let connection: Connection;
let channel: Channel;

export async function getRabbitChannel(): Promise<Channel> {
  if (!connection || !channel) {
    connection = await amqp.connect(config.rabbitmq_url) as any;
    channel = await connection.createChannel();
  }
  return channel;
}
