import { createExchange } from '../config/rabbitmq.js';
export const EXCHANGE_NAME = 'metrics_exchange';

const publishMessage = async (message) => {
  const exchangeName = EXCHANGE_NAME;
  try {
    const channel = await createExchange(exchangeName);
    console.log(`Publishing message ${message}`);
    const messageContent = JSON.stringify(message);

    const sent = channel.publish(exchangeName, "", Buffer.from(messageContent), {
      persistent: true,
      type: "fanout"
    });
    if (sent) {
      console.log(
        `✅ Message published to exchange "${exchangeName}"`,
        messageContent
      );
    } else {
      console.warn(
        `❌ Failed to publish message to exchange "${exchangeName}"`,
        messageContent
      );
    }

    return sent;
  } catch (error) {
    console.error(
      `❌ Error publishing message to exchange "${exchangeName}"`,
      error.message
    );
    throw error;
  }
};

export const publishMetrics = async (service_name, metricsData) => {
  return await publishMessage({
    type: 'METRICS_DATA',
    source: service_name,
    timestamp: new Date().toISOString(),
    data: metricsData,
  });
};

export const publishAlert = async (service_name, alertData) => {
  return await publishMessage('system.alert', {
    type: 'ALERT',
    source: service_name,
    timestamp: new Date().toISOString(),
    severity: alertData.severity || 'warning',
    data: alertData,
  });
};
