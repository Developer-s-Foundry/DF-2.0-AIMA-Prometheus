import express from 'express';
import MetricsController from '../controllers/metricsController.js';

const router = express.Router();

router.get('/', MetricsController.fetchMetrics);

router.get('/range', MetricsController.fetchRangeMetrics);

export default router;
