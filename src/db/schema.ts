import { pgTable, text, integer, real, boolean, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
  feedbackTone: text("feedback_tone").notNull().default("coach"),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  trackId: text("track_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  content: text("content").notNull(),
  generatedPrompt: text("generated_prompt"),
  generatedTitle: text("generated_title"),
  generatedCategory: text("generated_category"),
  score: real("score"),
  feedback: text("feedback"),
  criteriaResults: text("criteria_results"),
  passed: boolean("passed"),
  submittedAt: integer("submitted_at").notNull(),
});

export const projectProgress = pgTable("project_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id").notNull(),
  phaseId: text("phase_id").notNull(),
  content: text("content"),
  score: real("score"),
  feedback: text("feedback"),
  criteriaResults: text("criteria_results"),
  passed: boolean("passed").notNull().default(false),
  attempts: integer("attempts").notNull().default(0),
  completedAt: integer("completed_at"),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  trackId: text("track_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  bestScore: real("best_score"),
  attempts: integer("attempts").notNull().default(0),
  completedAt: integer("completed_at"),
});
