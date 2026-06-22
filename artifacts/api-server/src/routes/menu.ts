import { Router } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

function mapItem(item: typeof menuItemsTable.$inferSelect) {
  return {
    item_id: item.item_id,
    restaurant_id: item.restaurant_id,
    name: item.name,
    price: Number(item.price),
    category: item.category,
    description: item.description ?? null,
    available: item.available,
    image_url: item.image_url ?? null,
    created_at: item.created_at?.toISOString() ?? null,
  };
}

// GET /menu/:restaurantId
router.get("/:restaurantId", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.restaurant_id, req.params.restaurantId))
      .orderBy(menuItemsTable.created_at);
    res.json(items.map(mapItem));
  } catch (err) {
    req.log.error(err, "Error fetching menu");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /menu/:restaurantId
router.post("/:restaurantId", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    category: z.string().optional().default("Classic"),
    description: z.string().optional(),
    available: z.boolean().optional().default(true),
    image_url: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [item] = await db
      .insert(menuItemsTable)
      .values({
        restaurant_id: req.params.restaurantId,
        name: parsed.data.name,
        price: String(parsed.data.price),
        category: parsed.data.category,
        description: parsed.data.description,
        available: parsed.data.available,
        image_url: parsed.data.image_url,
      })
      .returning();
    res.status(201).json(mapItem(item));
  } catch (err) {
    req.log.error(err, "Error creating menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /menu/:restaurantId/:itemId
router.put("/:restaurantId/:itemId", async (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    available: z.boolean().optional(),
    image_url: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const update: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) update.name = parsed.data.name;
    if (parsed.data.price !== undefined) update.price = String(parsed.data.price);
    if (parsed.data.category !== undefined) update.category = parsed.data.category;
    if (parsed.data.description !== undefined) update.description = parsed.data.description;
    if (parsed.data.available !== undefined) update.available = parsed.data.available;
    if (parsed.data.image_url !== undefined) update.image_url = parsed.data.image_url;

    const [item] = await db
      .update(menuItemsTable)
      .set(update)
      .where(
        and(
          eq(menuItemsTable.item_id, req.params.itemId),
          eq(menuItemsTable.restaurant_id, req.params.restaurantId)
        )
      )
      .returning();

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json(mapItem(item));
  } catch (err) {
    req.log.error(err, "Error updating menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /menu/:restaurantId/:itemId
router.delete("/:restaurantId/:itemId", async (req, res) => {
  try {
    await db
      .delete(menuItemsTable)
      .where(
        and(
          eq(menuItemsTable.item_id, req.params.itemId),
          eq(menuItemsTable.restaurant_id, req.params.restaurantId)
        )
      );
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Error deleting menu item");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /menu/:restaurantId/:itemId — toggle availability
router.patch("/:restaurantId/:itemId", async (req, res) => {
  const schema = z.object({ available: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  try {
    const [item] = await db
      .update(menuItemsTable)
      .set({ available: parsed.data.available })
      .where(
        and(
          eq(menuItemsTable.item_id, req.params.itemId),
          eq(menuItemsTable.restaurant_id, req.params.restaurantId)
        )
      )
      .returning();

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json(mapItem(item));
  } catch (err) {
    req.log.error(err, "Error toggling availability");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
