import { pgTable, text, boolean, decimal, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuItemsTable = pgTable("menu_items", {
  item_id: uuid("item_id").primaryKey().defaultRandom(),
  restaurant_id: text("restaurant_id").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull().default("Classic"),
  description: text("description"),
  available: boolean("available").notNull().default(true),
  image_url: text("image_url"),
  is_veg: boolean("is_veg").notNull().default(true),
  spice_level: text("spice_level"),
  allergens: text("allergens"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ item_id: true, created_at: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItemRow = typeof menuItemsTable.$inferSelect;
