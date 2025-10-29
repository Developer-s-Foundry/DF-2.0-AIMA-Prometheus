import { createConnection, EXCHANGE_NAME } from './connection.js';

let channel = null;

async function getChannel() {
  if (!channel) {
    channel = await createConnection();
  }

  return channel;
}

const publishMessage = async (routingKey, message, exchangeName = EXCHANGE_NAME, options) => {
  try {
    const channel = await getChannel();

    const messageContent = typeof message === 'string' ? message : JSON.stringify(message);

    const sent = channel.publish(exchangeName, routingKey, Buffer.from(messageContent), {
      persistent: true,
      ...options,
    });

    if (sent) {
      console.log(
        `✅ Message published to exchange "${exchangeName}" with routing key "${routingKey}":`,
        messageContent
      );
    } else {
      console.warn(
        `❌ Failed to publish message to exchange "${exchangeName}" with routing key "${routingKey}":`,
        messageContent
      );
    }

    return sent;
  } catch (error) {
    console.error(
      `❌ Error publishing message to exchange "${exchangeName}" with routing key "${routingKey}":`,
      error.message
    );
    throw error;
  }
};

export const publishMetrics = async (metricsData) => {
  return await publishMessage('metrics.data', {
    type: 'METRICS_DATA',
    source: 'metrics-consumer-service',
    timestamp: new Date().toISOString(),
    data: metricsData,
  });
};

export const publishAlert = async (alertData) => {
  return await publishMessage('system.alert', {
    type: 'ALERT',
    source: 'metrics-consumer-service',
    timestamp: new Date().toISOString(),
    severity: alertData.severity || 'warning',
    data: alertData,
  });
};
