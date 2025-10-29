export const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';
export const SERVICE_NAME = 'metrics-consumer-service';

export const METRICS_QUERIES = {
  http_requests_total: 'http_requests_total',
  http_request_duration_seconds: 'http_request_duration_seconds_count',
  http_request_duration_seconds_avg:
    'rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])',
  memory_usage: 'process_resident_memory_bytes',
  cpu_usage: 'process_cpu_seconds_total',
};

export const EVENT_TYPES = {
  FETCH_ALL: 'METRICS_FETCH_ALL',
  FETCH_MULTIPLE: 'METRICS_FETCH_MULTIPLE',
  FETCH_CUSTOM: 'METRICS_FETCH_CUSTOM_QUERY',
  ERROR: 'METRICS_FETCH_ERROR',
};

export const DEFAULT_QUERY_STEP = '300';
