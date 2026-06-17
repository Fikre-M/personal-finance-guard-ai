const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler } = require("./middleware/errorHandler");
const { limiter } = require("./middleware/rateLimiter");
const logger = require("./middleware/logger");

// Route imports
const healthRoutes = require("./routes/healthRoutes");

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── General Middleware ────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(logger);
app.use("/api", limiter);

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/health", healthRoutes);

// Future routes (Day 3+)
// app.use("/api/auth",     authRoutes);
// app.use("/api/users",    userRoutes);
// app.use("/api/budget",   budgetRoutes);
// app.use("/api/remit",    remittanceRoutes);
// app.use("/api/currency", currencyRoutes);

// ─── Root Route ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🌍 Diaspora Finance Guard AI — API",
    docs: "/api/health",
    version: "1.0.0",
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;