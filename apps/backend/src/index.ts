import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/auth/authRoutes";
import repoRouter from "./modules/repo/repoRoutes";
import userRouter from "./modules/user/userRoutes";
import githubWebhookRoute from "./modules/hook/githubWebhookRoutes";

// Environment validation
const requiredEnvVars = [
  "DATABASE_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_REDIRECT_URI",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();
const PORT = Number(process.env.PORT) | 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Request logging (development only)
if (NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/repo", repoRouter);
app.use("/user", userRouter);
app.use("/github", githubWebhookRoute);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
});
