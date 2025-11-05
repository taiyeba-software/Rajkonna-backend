// server.js
require("dotenv").config(); // 🔑 .env file থেকে secret variables load করবে
const app = require("./src/app"); // তোমার main express app
const connectDB = require("./src/db/db"); // MongoDB connect function
const redisService = require("./src/services/redis.service"); // Redis service

const PORT = process.env.PORT || 5000; // Default port 5000

// 🚀 Database and Redis connect and server start
Promise.all([
  connectDB(),
  redisService.connect()
])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Service connection failed:", err);
  });
