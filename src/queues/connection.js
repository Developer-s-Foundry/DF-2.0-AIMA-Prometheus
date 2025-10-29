import { connect } from 'amqplib';

const RABBITMQ_URL = 'amqps://sqitokin:Mwc__94W-6MB6Bo5GllZpc_gkG0hx8HO@shrimp.rmq.cloudamqp.com/sqitokin';

export const EXCHANGE_NAME = 'metrics_exchange';
export const QUEUES = {
  METRICS_DATA: 'metrics_data_queue',
  ALERTS: 'alerts_queue',
};

export const ROUTING_KEYS = {
  METRICS: 'metrics.data',
  ALERT: 'system.alert',
};

let connection = null;
let channel = null;

export async function createConnection() {
  try {
    if (connection) return channel;

    console.log('🔗 Connecting to RabbitMQ...');

    connection = await connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Create the main exchange
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

    console.log('✅ Connected to RabbitMQ successfully');

    // Handle connection events
    connection.on('close', () => {
      console.log('❌ RabbitMQ connection closed');
      connection = null;
      channel = null;
      setTimeout(createConnection, 5000);
    });

    connection.on('error', (error) => {
      console.error('❌ RabbitMQ connection error:', error.message);
      connection = null;
      channel = null;
    });

    return channel;
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error.message);
    connection = null;
    channel = null;
    throw error;
  }
}

export function isConnected() {
  return !!connection;
}

export async function closeRabbitMQ() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  isConnected = false;
  console.log('🔌 RabbitMQ connection closed');
}
