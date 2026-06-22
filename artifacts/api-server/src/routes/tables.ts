import { Router } from "express";
import { db } from "@workspace/db";
import { restaurantTablesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

const toJson = (t: typeof restaurantTablesTable.$inferSelect) => ({
  table_id: t.table_id,
  restaurant_id: t.restaurant_id,
  table_number: t.table_number,
  seats: t.seats,
  status: t.status,
  label: t.label ?? null,
  created_at: t.created_at?.toISOString() ?? null,
});

// GET /tables/:restaurantId
router.get("/:restaurantId", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(restaurantTablesTable)
      .where(eq(restaurantTablesTable.restaurant_id, req.params.restaurantId))
      .orderBy(restaurantTablesTable.table_number);
    res.json(rows.map(toJson));
  } catch (err) {
    req.log.error(err, "Error fetching tables");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /tables/:restaurantId
router.post("/:restaurantId", async (req, res) => {
  const schema = z.object({
    table_number: z.string().min(1),
    seats: z.number().int().min(1).default(4),
    label: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [row] = await db
      .insert(restaurantTablesTable)
      .values({ restaurant_id: req.params.restaurantId, ...parsed.data })
      .returning();
    res.status(201).json(toJson(row));
  } catch (err) {
    req.log.error(err, "Error creating table");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /tables/:restaurantId/:tableId
router.patch("/:restaurantId/:tableId", async (req, res) => {
  const schema = z.object({
    status: z.enum(["free", "occupied", "reserved"]).optional(),
    label: z.string().optional(),
    seats: z.number().int().min(1).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [row] = await db
      .update(restaurantTablesTable)
      .set(parsed.data)
      .where(and(
        eq(restaurantTablesTable.restaurant_id, req.params.restaurantId),
        eq(restaurantTablesTable.table_id, req.params.tableId),
      ))
      .returning();
    if (!row) { res.status(404).json({ error: "Table not found" }); return; }
    res.json(toJson(row));
  } catch (err) {
    req.log.error(err, "Error updating table");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /tables/:restaurantId/:tableId
router.delete("/:restaurantId/:tableId", async (req, res) => {
  try {
    await db
      .delete(restaurantTablesTable)
      .where(and(
        eq(restaurantTablesTable.restaurant_id, req.params.restaurantId),
        eq(restaurantTablesTable.table_id, req.params.tableId),
      ));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Error deleting table");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
