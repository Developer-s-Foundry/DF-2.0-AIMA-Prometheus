import express from 'express';
import metricsRoutes from './routes/metrics.js';
import { APP_CONFIGS } from './config/index.js';
import { dbInstance } from './config/database.js';
import { consumeProjectMessages } from './queues/consumer.js';

const app = express();
app.use(express.json());
app.use('/fetch-metrics', metricsRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Ok', timestamp: new Date().toISOString() });
});

(async () => {
  await dbInstance()
  await consumeProjectMessages();
})();

const PORT = APP_CONFIGS.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Metrics Consumer Service running on port ${PORT}`);
  console.log(`Fetch metrics at http://localhost:${PORT}/fetch-metrics`);
});

export default app;

// http://localhost:3001/fetch-metrics?type=prometheus&query=up{instance="localhost:3000"}
