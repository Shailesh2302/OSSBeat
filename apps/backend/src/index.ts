import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/auth/authRoutes";
import repoRouter from "./modules/repo/repoRoutes";
import userRouter from "./modules/user/userRoutes";
import githubWebhookRoute from "./modules/hook/githubWebhookRoutes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import featureRoute from "./modules/features/featureRoutes";
import statsRoute from "./modules/stats/statsRoutes";
import newsletterRoute from "./modules/newsletter/newsletterRoutes";
import contactRoute from "./modules/contact/contactRoutes";

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
const PORT = 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

if (NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/repo", repoRouter);
app.use("/user", userRouter);
app.use("/github", githubWebhookRoute);
app.use("/feature", featureRoute);
app.use("/stats", statsRoute);
app.use("/newsletter", newsletterRoute);
app.use("/contact", contactRoute);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(globalErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
});
