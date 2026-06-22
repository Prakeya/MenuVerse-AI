import { pgTable, text, decimal, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  order_id: uuid("order_id").primaryKey().defaultRandom(),
  restaurant_id: text("restaurant_id").notNull(),
  status: text("status").notNull().default("pending"),
  items: jsonb("items").notNull().default([]),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  table_number: text("table_number"),
  notes: text("notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ order_id: true, created_at: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderRow = typeof ordersTable.$inferSelect;
