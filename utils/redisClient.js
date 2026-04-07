const Redis = require("ioredis");

let redis;

if (!global.redis) {
  global.redis = new Redis(process.env.REDIS_URL, {
    tls: {},
    maxRetriesPerRequest: 3, // prevent long retry loops
  });

  global.redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  global.redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });
}

redis = global.redis;

module.exports = redis;