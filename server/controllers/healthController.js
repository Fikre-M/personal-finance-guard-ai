const mongoose = require("mongoose");
const os = require("os");

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
const healthCheck = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const healthData = {
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    server: {
      uptime: `${Math.floor(process.uptime())}s`,
      platform: os.platform(),
      nodeVersion: process.version,
      memoryUsage: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    },
    database: {
      status: dbStatus[dbState] || "unknown",
      name: mongoose.connection.name || "N/A",
    },
    app: {
      name: "Diaspora Finance Guard AI",
      version: "1.0.0",
      description: "AI-powered financial assistant for the diaspora community",
    },
  };

  const httpStatus = dbState === 1 ? 200 : 503;
  res.status(httpStatus).json(healthData);
};

module.exports = { healthCheck };