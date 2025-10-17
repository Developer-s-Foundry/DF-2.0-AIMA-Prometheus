// app/server.js
import express from "express";
import client from "prom-client";

const app = express();
const port = 3000;

// Create a registry and collect default metrics (CPU, memory, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Counter: total HTTP requests
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code", "status"],
});
register.registerMetric(httpRequests);

// Histogram: request duration in seconds
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5], // useful buckets for API latency
});
register.registerMetric(httpRequestDuration);

// Middleware to measure requests
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const status = res.statusCode >= 400 ? "error" : "success";

    httpRequests.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
      status,
    });

    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
      status,
    });
  });

  next();
});

// Example routes
app.get("/", (req, res) => {
  res.send("Hello from the service! 🌍");
});

app.get("/api/test", (req, res) => {
  setTimeout(() => {
    res.json({ msg: "Simulated API response with delay" });
  }, 500); // simulate latency
});

// Error route (to test failure metrics)
app.get("/api/error", (req, res) => {
  res.status(500).json({ error: "Something went wrong!" });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`🚀 App running on port ${port}`);
});
