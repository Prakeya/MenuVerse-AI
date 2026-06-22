import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ratingsTable = pgTable("ratings", {
  rating_id: uuid("rating_id").primaryKey().defaultRandom(),
  restaurant_id: text("restaurant_id").notNull(),
  item_id: text("item_id").notNull(),
  phone: text("phone"),
  rating: integer("rating").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertRatingSchema = createInsertSchema(ratingsTable).omit({ rating_id: true, created_at: true });
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type RatingRow = typeof ratingsTable.$inferSelect;
