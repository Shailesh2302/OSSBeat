import { Router, Request, Response } from "express";
import axios from "axios";

const router: Router = Router();

const CHATBOT_URL = process.env.CHATBOT_URL || "http://localhost:8000";

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${CHATBOT_URL}/chat`, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      res.status(503).json({ error: "Chatbot service unavailable" });
    } else {
      res.status(502).json({ error: "Chatbot proxy error" });
    }
  }
});

router.get("/health", async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${CHATBOT_URL}/health`);
    res.json(response.data);
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});

export default router;
