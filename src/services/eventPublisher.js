import { isConnected } from '../queues/connection.js';
import { publishMetrics } from '../queues/producer.js';
import { generateEventId } from '../utils/helpers.js';
import { SERVICE_NAME, EVENT_TYPES } from '../utils/constants.js';

class EventPublisher {
  static async publishMetricsEvent(eventType, metricsData, metadata = {}) {
    if (!isConnected()) {
      console.log('RabbitMQ not connected, skipping event publishing');
      return false;
    }

    try {
      const event = {
        eventId: generateEventId(),
        type: eventType,
        source: SERVICE_NAME,
        timestamp: new Date().toISOString(),
        version: '1.0',
        metadata,
        data: metricsData,
      };

      const sent = await publishMetrics(event);

      if (sent) {
        console.log(`📤 Event published: ${eventType}`);
      }

      return sent;
    } catch (error) {
      console.error('❌ Failed to publish metrics event:', error.message);
      return false;
    }
  }

  static async publishErrorEvent(error, context, additionalData = {}) {
    if (!isConnected()) return false;

    try {
      const errorEvent = {
        eventId: generateEventId('error'),
        type: EVENT_TYPES.ERROR,
        source: SERVICE_NAME,
        timestamp: new Date().toISOString(),
        severity: 'error',
        context,
        error: {
          message: error.message,
          stack: error.stack,
        },
        additionalData,
      };

      return await publishMetrics(errorEvent);
    } catch (rabbitError) {
      console.error('❌ Failed to publish error event:', rabbitError.message);
      return false;
    }
  }
}

export default EventPublisher;
