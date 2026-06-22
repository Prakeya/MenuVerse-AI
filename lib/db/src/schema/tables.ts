import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const restaurantTablesTable = pgTable("restaurant_tables", {
  table_id: uuid("table_id").primaryKey().defaultRandom(),
  restaurant_id: text("restaurant_id").notNull(),
  table_number: text("table_number").notNull(),
  seats: integer("seats").notNull().default(4),
  status: text("status").notNull().default("free"),
  label: text("label"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertRestaurantTableSchema = createInsertSchema(restaurantTablesTable).omit({ table_id: true, created_at: true });
export type InsertRestaurantTable = z.infer<typeof insertRestaurantTableSchema>;
export type RestaurantTableRow = typeof restaurantTablesTable.$inferSelect;
