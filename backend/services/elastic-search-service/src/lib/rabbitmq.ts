import * as amqp from 'amqplib';
import { Channel, ChannelModel } from 'amqplib';
import { config } from '../config/env';

let connection: ChannelModel; 
let channel: Channel;

export async function getRabbitChannel(): Promise<Channel> {
  if (!connection || !channel) {
    connection = await amqp.connect(config.rabbitmq_url) as ChannelModel;
    channel = await connection.createChannel();
  }
  return channel;
}