import MetricsService from '../services/metricsService.js';
import EventPublisher from '../services/eventPublisher.js';
import { isConnected } from '../queues/connection.js';
import { createSuccessResponse, createErrorResponse } from '../utils/helpers.js';
import { EVENT_TYPES } from '../utils/constants.js';

class MetricsController {
  static async fetchMetrics(req, res) {
    try {
      const { type = 'all', query: customQuery } = req.query;
      const result = await MetricsController.handleMetricsFetch(type, customQuery);
      res.json(result);
    } catch (error) {
      console.error('Error in /fetch-metrics:', error);

      await EventPublisher.publishErrorEvent(error, 'main_metrics_endpoint', {
        queryType: req.query.type,
        customQuery: req.query.query,
      });

      const errorResponse = createErrorResponse(error);
      res.status(500).json(errorResponse);
    }
  }

  static async fetchRangeMetrics(req, res) {
    try {
      const { query, start, end, step = '300' } = req.query;
      const data = await MetricsService.fetchRangeMetrics(query, start, end, step);

      const response = createSuccessResponse(data, { query });
      res.json(response);
    } catch (error) {
      console.error('Error in /fetch-metrics/range:', error);

      const statusCode = error.message.includes('required') ? 400 : 500;
      const errorResponse = createErrorResponse(error, statusCode);
      res.status(statusCode).json(errorResponse);
    }
  }

  static async handleMetricsFetch(type, customQuery) {
    let metricsData = {};
    let eventType = EVENT_TYPES.FETCH_ALL;

    if (type === 'prometheus' && customQuery) {
      metricsData.prometheus = await MetricsService.fetchPrometheusMetrics(customQuery);
      eventType = EVENT_TYPES.FETCH_CUSTOM;
    } else {
      metricsData.prometheus = await MetricsService.fetchMultipleMetrics();
      eventType = type === 'prometheus' ? EVENT_TYPES.FETCH_MULTIPLE : EVENT_TYPES.FETCH_ALL;
    }

    const eventPublished = await EventPublisher.publishMetricsEvent(eventType, metricsData, {
      queryType: type,
      customQuery,
      requestedAt: new Date().toISOString(),
    });

    return createSuccessResponse(metricsData, {
      event_driven: true,
      event_published: eventPublished,
      event_type: eventType,
      rabbitmq_connected: isConnected(),
    });
  }
}

export default MetricsController;
