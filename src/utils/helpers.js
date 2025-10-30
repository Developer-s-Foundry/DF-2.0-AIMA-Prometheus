import dotenv from 'dotenv';
dotenv.config();

export const generateEventId = (prefix = 'event') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

export const buildPrometheusUrl = (endpoint, params) => {
  const url = new URL(`${process.env.PROMETHEUS_URL || 'http://localhost:9090'}/api/v1/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

export const createErrorResponse = (error, statusCode = 500) => ({
  success: false,
  error: error.message,
  timestamp: new Date().toISOString(),
  statusCode,
});

export const createSuccessResponse = (data, additionalProps = {}) => ({
  success: true,
  timestamp: new Date().toISOString(),
  ...additionalProps,
  data,
});
