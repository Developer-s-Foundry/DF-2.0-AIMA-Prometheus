import express from 'express';
import metricsRoutes from './routes/metrics.js';
import { createConnection } from './queues/connection.js';

const app = express();
const PORT = 3001;

createConnection()
  .then(() => {
    console.log('✅ RabbitMQ connected');
  })
  .catch((error) => {
    console.log('⚠️  RabbitMQ not connected, continuing without it');
  });

app.use(express.json());

app.use('/fetch-metrics', metricsRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Metrics Consumer Service running on port ${PORT}`);
  console.log(`Fetch metrics at http://localhost:${PORT}/fetch-metrics`);
});

export default app;

// http://localhost:3001/fetch-metrics?type=prometheus&query=up{instance="localhost:3000"}
