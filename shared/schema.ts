import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ---------------------------------------------------------------------------
// Chat messages (used by both the "AboutMe" portfolio chatbot and the
// "Nexus AI" personal assistant. `channel` distinguishes the two.)
// ---------------------------------------------------------------------------
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channel: text("channel").notNull().default("chat"), // "chat" | "assistant"
  sender: text("sender").notNull(), // "user" | "bot"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  channel: true,
  sender: true,
  content: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ---------------------------------------------------------------------------
// Tasks (Nexus AI assistant sidebar)
// ---------------------------------------------------------------------------
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  dueLabel: text("due_label").notNull().default(""),
  priority: text("priority").notNull().default("medium"), // "low" | "medium" | "high"
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  dueLabel: true,
  priority: true,
});

export const updateTaskSchema = createInsertSchema(tasks)
  .pick({ title: true, dueLabel: true, priority: true, completed: true })
  .partial();

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// ---------------------------------------------------------------------------
// Memories (Nexus AI "Memory Bank")
// ---------------------------------------------------------------------------
export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemorySchema = createInsertSchema(memories).pick({
  content: true,
});

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;

// ---------------------------------------------------------------------------
// Fake-news analyses
// ---------------------------------------------------------------------------
export const newsAnalyses = pgTable("news_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  score: real("score").notNull(),
  label: text("label").notNull(),
  confidence: integer("confidence").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsAnalysisSchema = createInsertSchema(newsAnalyses).pick({
  content: true,
  score: true,
  label: true,
  confidence: true,
});

export type InsertNewsAnalysis = z.infer<typeof insertNewsAnalysisSchema>;
export type NewsAnalysis = typeof newsAnalyses.$inferSelect;
