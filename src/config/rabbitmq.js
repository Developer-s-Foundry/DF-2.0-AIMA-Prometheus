import amqplib from "amqplib";
import { logger } from "./logger.js";
import { APP_CONFIGS } from "./index.js";


export async function rabbitMqConnection(){ 
 try {
    const connection = await amqplib.connect(
      APP_CONFIGS.RABBIT_MQ.URL
    );
    logger.info("Connected to RabbitMQ successfully");
    return connection;
 } catch (error) {
    throw new Error("Failed to connect to RabbitMQ: " + error);
 }
}

export async function rabbitMqChannel() {
  try {
     const connection = await rabbitMqConnection();
     if (!connection) {
        throw new Error("No RabbitMQ connection available");
     }
     
     const channel = await connection.createChannel();
     if (!channel) {
        throw new Error("Failed to create RabbitMQ channel");
     }
     return channel;
    return connection;
  } catch (error) {
    throw new Error("Failed to connect to RabbitMQ: " + error);
  }
}