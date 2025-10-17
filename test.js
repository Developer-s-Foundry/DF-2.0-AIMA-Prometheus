// // app/test.js
// import axios from "axios";

// const APP_URL = "http://localhost:3000";
// const PROM_URL = "http://localhost:9090";

// async function testApp() {
//   try {
//     console.log("🧪 Testing app endpoints...");

//     // Hit the main route
//     const rootRes = await axios.get(`${APP_URL}/`);
//     console.log("Root endpoint response:", rootRes.data);

//     // Hit the metrics route
//     const metricsRes = await axios.get(`${APP_URL}/metrics`);
//     console.log("✅ /metrics endpoint is working!");
//     console.log("Sample metrics output:");
//     console.log(metricsRes.data.split("\n").slice(0, 10).join("\n")); // show first 10 lines
//   } catch (err) {
//     console.error("❌ App test failed:", err.message);
//   }
// }

// async function testPrometheus() {
//   try {
//     console.log("\n🧪 Testing Prometheus API...");

//     // Check Prometheus target status
//     const targets = await axios.get(`${PROM_URL}/api/v1/targets`);
//     const activeTargets = targets.data.data.activeTargets;
//     console.log("Prometheus targets:");
//     activeTargets.forEach(t => {
//       console.log(` - ${t.labels.job} | ${t.health} | ${t.scrapeUrl}`);
//     });

//     // Query a metric value
//     const query = 'http_requests_total';
//     const metricRes = await axios.get(`${PROM_URL}/api/v1/query`, {
//       params: { query },
//     });
//     console.log("\nQueried metric:", query);
//     console.log(metricRes.data.data.result || "No data yet");
//   } catch (err) {
//     console.error("❌ Prometheus test failed:", err.message);
//   }
// }

// async function main() {
//   await testApp();
//   await new Promise(r => setTimeout(r, 3000)); // wait a bit for Prometheus scrape
//   await testPrometheus();
// }

// main();
