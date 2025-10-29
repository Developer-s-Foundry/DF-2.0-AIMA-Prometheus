import axios from 'axios';
import { buildPrometheusUrl } from '../utils/helpers.js';
import { METRICS_QUERIES } from '../utils/constants.js';

class MetricsService {
  static async fetchPrometheusMetrics(query) {
    try {
      const url = buildPrometheusUrl('query', { query });
      console.log(`Querying Prometheus: ${url}`);

      const response = await axios.get(url);

      if (response.data.status !== 'success') {
        throw new Error(`Prometheus API error: ${response.data.error}`);
      }

      return {
        source: 'prometheus',
        data: response.data.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to fetch metrics for query "${query}":`, error.message);
      throw new Error(`Prometheus query failed: ${error.message}`);
    }
  }

  static async fetchMultipleMetrics(queries = METRICS_QUERIES) {
    const promises = Object.entries(queries).map(async ([key, query]) => {
      try {
        const result = await this.fetchPrometheusMetrics(query);
        return { [key]: result };
      } catch (error) {
        return { [key]: { error: error.message } };
      }
    });

    const results = await Promise.all(promises);
    return Object.assign({}, ...results);
  }

  /**
   * Fetch metrics with range query
   */
  static async fetchRangeMetrics(query, start, end, step = '300') {
    if (!query) {
      throw new Error('Query parameter is required');
    }

    const url = buildPrometheusUrl('query_range', { query, start, end, step });
    console.log(`Querying Prometheus range: ${url}`);

    const response = await axios.get(url);

    if (response.data.status !== 'success') {
      throw new Error(`Prometheus API error: ${response.data.error}`);
    }

    return response.data.data;
  }
}

export default MetricsService;
