import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertTaskSchema,
  updateTaskSchema,
  insertMemorySchema,
} from "@shared/schema";
import {
  CHAT_INTRO_MESSAGE,
  generateChatResponse,
  generateAssistantResponse,
  analyzeNewsContent,
} from "@shared/chatbot";

const channelParam = z.enum(["chat", "assistant"]);

function handleError(res: Response, err: unknown) {
  console.error(err);
  const message = err instanceof z.ZodError ? err.errors.map((e) => e.message).join(", ") : (err as Error).message;
  res.status(400).json({ message: message || "Invalid request" });
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // -------------------------------------------------------------------
  // Health
  // -------------------------------------------------------------------
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // -------------------------------------------------------------------
  // Chat messages — used by /chat (portfolio bot) and /assistant (Nexus AI)
  // channel = "chat" | "assistant"
  // -------------------------------------------------------------------
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const channel = channelParam.parse(req.query.channel ?? "chat");
      const messages = await storage.getMessages(channel);

      // Seed the very first visit with an intro bot message for the
      // portfolio chatbot so the UI never looks empty.
      if (channel === "chat" && messages.length === 0) {
        const intro = await storage.addMessage({
          channel: "chat",
          sender: "bot",
          content: CHAT_INTRO_MESSAGE,
        });
        return res.json([intro]);
      }

      res.json(messages);
    } catch (err) {
      handleError(res, err);
    }
  });

  const sendMessageSchema = z.object({
    content: z.string().trim().min(1, "Message cannot be empty"),
    channel: channelParam.default("chat"),
  });

  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const { content, channel } = sendMessageSchema.parse(req.body);

      const userMessage = await storage.addMessage({
        channel,
        sender: "user",
        content,
      });

      const replyText =
        channel === "chat" ? generateChatResponse(content) : generateAssistantResponse(content);

      const botMessage = await storage.addMessage({
        channel,
        sender: "bot",
        content: replyText,
      });

      res.status(201).json({ userMessage, botMessage });
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete("/api/messages", async (req: Request, res: Response) => {
    try {
      const channel = channelParam.parse(req.query.channel ?? "chat");
      await storage.clearMessages(channel);
      res.status(204).end();
    } catch (err) {
      handleError(res, err);
    }
  });

  // -------------------------------------------------------------------
  // Tasks (Nexus AI assistant)
  // -------------------------------------------------------------------
  app.get("/api/tasks", async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getTasks());
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      res.status(201).json(await storage.createTask(data));
    } catch (err) {
      handleError(res, err);
    }
  });

  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const data = updateTaskSchema.parse(req.body);
      const updated = await storage.updateTask(req.params.id, data);
      if (!updated) return res.status(404).json({ message: "Task not found" });
      res.json(updated);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Task not found" });
      res.status(204).end();
    } catch (err) {
      handleError(res, err);
    }
  });

  // -------------------------------------------------------------------
  // Memories (Nexus AI "Memory Bank")
  // -------------------------------------------------------------------
  app.get("/api/memories", async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getMemories());
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post("/api/memories", async (req: Request, res: Response) => {
    try {
      const data = insertMemorySchema.parse(req.body);
      res.status(201).json(await storage.createMemory(data));
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete("/api/memories/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteMemory(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Memory not found" });
      res.status(204).end();
    } catch (err) {
      handleError(res, err);
    }
  });

  // -------------------------------------------------------------------
  // Fake-news detector
  // -------------------------------------------------------------------
  const analyzeSchema = z.object({
    text: z.string().trim().min(5, "Please provide more content to analyze"),
  });

  app.post("/api/news/analyze", async (req: Request, res: Response) => {
    try {
      const { text } = analyzeSchema.parse(req.body);
      const result = analyzeNewsContent(text);
      const saved = await storage.createNewsAnalysis({
        content: text.slice(0, 2000),
        score: result.score,
        label: result.label,
        confidence: result.confidence,
      });
      res.status(201).json({ ...saved, reasons: result.reasons });
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get("/api/news/history", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      res.json(await storage.getNewsAnalyses(limit));
    } catch (err) {
      handleError(res, err);
    }
  });

  // -------------------------------------------------------------------
  // Dashboard stats
  // -------------------------------------------------------------------
  app.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getStats());
    } catch (err) {
      handleError(res, err);
    }
  });

  return httpServer;
}
