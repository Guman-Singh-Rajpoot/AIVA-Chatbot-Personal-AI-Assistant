import { randomUUID } from "crypto";
import { eq, and, desc } from "drizzle-orm";
import { db, hasDatabase } from "./db";
import {
  users,
  chatMessages,
  tasks,
  memories,
  newsAnalyses,
  type User,
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type Task,
  type InsertTask,
  type UpdateTask,
  type Memory,
  type InsertMemory,
  type NewsAnalysis,
  type InsertNewsAnalysis,
} from "@shared/schema";

export interface IStorage {
  // users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // chat messages (portfolio bot + assistant, split by `channel`)
  getMessages(channel: string): Promise<ChatMessage[]>;
  addMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearMessages(channel: string): Promise<void>;

  // tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // memories
  getMemories(): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: string): Promise<boolean>;

  // fake-news analyses
  getNewsAnalyses(limit?: number): Promise<NewsAnalysis[]>;
  createNewsAnalysis(analysis: InsertNewsAnalysis): Promise<NewsAnalysis>;

  // dashboard aggregate
  getStats(): Promise<{
    totalChatMessages: number;
    totalTasks: number;
    completedTasks: number;
    totalAnalyses: number;
  }>;
}

// ---------------------------------------------------------------------------
// In-memory implementation (zero-config local/dev fallback)
// ---------------------------------------------------------------------------
export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private messages: ChatMessage[] = [];
  private taskList: Task[] = [];
  private memoryList: Memory[] = [];
  private analyses: NewsAnalysis[] = [];

  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser) {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMessages(channel: string) {
    return this.messages
      .filter((m) => m.channel === channel)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addMessage(message: InsertChatMessage) {
    const msg: ChatMessage = {
      id: randomUUID(),
      channel: message.channel ?? "chat",
      sender: message.sender,
      content: message.content,
      createdAt: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  async clearMessages(channel: string) {
    this.messages = this.messages.filter((m) => m.channel !== channel);
  }

  async getTasks() {
    return [...this.taskList].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTask(task: InsertTask) {
    const newTask: Task = {
      id: randomUUID(),
      title: task.title,
      dueLabel: task.dueLabel ?? "",
      priority: task.priority ?? "medium",
      completed: false,
      createdAt: new Date(),
    };
    this.taskList.push(newTask);
    return newTask;
  }

  async updateTask(id: string, patch: UpdateTask) {
    const idx = this.taskList.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    this.taskList[idx] = { ...this.taskList[idx], ...patch };
    return this.taskList[idx];
  }

  async deleteTask(id: string) {
    const before = this.taskList.length;
    this.taskList = this.taskList.filter((t) => t.id !== id);
    return this.taskList.length < before;
  }

  async getMemories() {
    return [...this.memoryList].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMemory(memory: InsertMemory) {
    const newMemory: Memory = {
      id: randomUUID(),
      content: memory.content,
      createdAt: new Date(),
    };
    this.memoryList.push(newMemory);
    return newMemory;
  }

  async deleteMemory(id: string) {
    const before = this.memoryList.length;
    this.memoryList = this.memoryList.filter((m) => m.id !== id);
    return this.memoryList.length < before;
  }

  async getNewsAnalyses(limit = 20) {
    return [...this.analyses]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createNewsAnalysis(analysis: InsertNewsAnalysis) {
    const newAnalysis: NewsAnalysis = {
      id: randomUUID(),
      content: analysis.content,
      score: analysis.score,
      label: analysis.label,
      confidence: analysis.confidence,
      createdAt: new Date(),
    };
    this.analyses.push(newAnalysis);
    return newAnalysis;
  }

  async getStats() {
    return {
      totalChatMessages: this.messages.length,
      totalTasks: this.taskList.length,
      completedTasks: this.taskList.filter((t) => t.completed).length,
      totalAnalyses: this.analyses.length,
    };
  }
}

// ---------------------------------------------------------------------------
// Postgres-backed implementation (used automatically when DATABASE_URL set)
// ---------------------------------------------------------------------------
export class DbStorage implements IStorage {
  private get db() {
    if (!db) throw new Error("Database not initialized");
    return db;
  }

  async getUser(id: string) {
    const [row] = await this.db.select().from(users).where(eq(users.id, id));
    return row;
  }

  async getUserByUsername(username: string) {
    const [row] = await this.db.select().from(users).where(eq(users.username, username));
    return row;
  }

  async createUser(insertUser: InsertUser) {
    const [row] = await this.db.insert(users).values(insertUser).returning();
    return row;
  }

  async getMessages(channel: string) {
    return this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.channel, channel))
      .orderBy(chatMessages.createdAt);
  }

  async addMessage(message: InsertChatMessage) {
    const [row] = await this.db.insert(chatMessages).values(message).returning();
    return row;
  }

  async clearMessages(channel: string) {
    await this.db.delete(chatMessages).where(eq(chatMessages.channel, channel));
  }

  async getTasks() {
    return this.db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask) {
    const [row] = await this.db.insert(tasks).values(task).returning();
    return row;
  }

  async updateTask(id: string, patch: UpdateTask) {
    const [row] = await this.db.update(tasks).set(patch).where(eq(tasks.id, id)).returning();
    return row;
  }

  async deleteTask(id: string) {
    const result = await this.db.delete(tasks).where(eq(tasks.id, id)).returning({ id: tasks.id });
    return result.length > 0;
  }

  async getMemories() {
    return this.db.select().from(memories).orderBy(desc(memories.createdAt));
  }

  async createMemory(memory: InsertMemory) {
    const [row] = await this.db.insert(memories).values(memory).returning();
    return row;
  }

  async deleteMemory(id: string) {
    const result = await this.db.delete(memories).where(eq(memories.id, id)).returning({ id: memories.id });
    return result.length > 0;
  }

  async getNewsAnalyses(limit = 20) {
    return this.db.select().from(newsAnalyses).orderBy(desc(newsAnalyses.createdAt)).limit(limit);
  }

  async createNewsAnalysis(analysis: InsertNewsAnalysis) {
    const [row] = await this.db.insert(newsAnalyses).values(analysis).returning();
    return row;
  }

  async getStats() {
    const [msgs, taskRows, analysisRows] = await Promise.all([
      this.db.select().from(chatMessages),
      this.db.select().from(tasks),
      this.db.select().from(newsAnalyses),
    ]);
    return {
      totalChatMessages: msgs.length,
      totalTasks: taskRows.length,
      completedTasks: taskRows.filter((t) => t.completed).length,
      totalAnalyses: analysisRows.length,
    };
  }
}

if (hasDatabase) {
  console.log("[storage] Using PostgreSQL database (DATABASE_URL detected).");
} else {
  console.log(
    "[storage] No DATABASE_URL set — using in-memory storage. Data will reset on restart. " +
      "Set DATABASE_URL and run `npm run db:push` to persist data in Postgres.",
  );
}

export const storage: IStorage = hasDatabase ? new DbStorage() : new MemStorage();
