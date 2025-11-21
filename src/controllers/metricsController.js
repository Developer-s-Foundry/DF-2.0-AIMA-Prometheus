import MetricsService from '../services/metricsService.js';
import EventPublisher from '../services/eventPublisher.js';
import { createSuccessResponse, createErrorResponse } from '../utils/helpers.js';

class MetricsController {
  static async fetchMetrics(req, res) {
    try {
      const { metric_url } = req.query;
      const result = await MetricsService.handleMetricsFetch(`Elijah's Service`,metric_url);
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
}

export default MetricsController;
