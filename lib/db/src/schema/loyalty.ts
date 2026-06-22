import { pgTable, text, integer, decimal, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loyaltyProfilesTable = pgTable("loyalty_profiles", {
  profile_id: uuid("profile_id").primaryKey().defaultRandom(),
  restaurant_id: text("restaurant_id").notNull(),
  phone: text("phone").notNull(),
  name: text("name"),
  visit_count: integer("visit_count").notNull().default(0),
  total_spent: decimal("total_spent", { precision: 12, scale: 2 }).notNull().default("0"),
  last_visit: timestamp("last_visit"),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.restaurant_id, t.phone)]);

export const insertLoyaltyProfileSchema = createInsertSchema(loyaltyProfilesTable).omit({ profile_id: true, created_at: true });
export type InsertLoyaltyProfile = z.infer<typeof insertLoyaltyProfileSchema>;
export type LoyaltyProfileRow = typeof loyaltyProfilesTable.$inferSelect;
