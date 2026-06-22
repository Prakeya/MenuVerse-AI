import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { broadcast } from "../lib/sseHub";

const router = Router();

const toJson = (o: typeof ordersTable.$inferSelect) => ({
  order_id: o.order_id,
  restaurant_id: o.restaurant_id,
  status: o.status,
  items: o.items,
  amount: o.amount ? Number(o.amount) : null,
  table_number: o.table_number ?? null,
  notes: o.notes ?? null,
  created_at: o.created_at?.toISOString() ?? null,
});

// GET /orders/:restaurantId
router.get("/:restaurantId", async (req, res) => {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.restaurant_id, req.params.restaurantId))
      .orderBy(ordersTable.created_at);
    res.json(orders.map(toJson));
  } catch (err) {
    req.log.error(err, "Error fetching orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:restaurantId
router.post("/:restaurantId", async (req, res) => {
  const itemSchema = z.object({
    item_id: z.string(),
    quantity: z.number(),
    name: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
  });
  const schema = z.object({
    status: z.string().default("pending"),
    items: z.array(itemSchema),
    amount: z.number().optional(),
    table_number: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [order] = await db
      .insert(ordersTable)
      .values({
        restaurant_id: req.params.restaurantId,
        status: parsed.data.status,
        items: parsed.data.items,
        amount: parsed.data.amount !== undefined ? String(parsed.data.amount) : null,
        table_number: parsed.data.table_number ?? null,
        notes: parsed.data.notes ?? null,
      })
      .returning();

    const payload = toJson(order);

    // Broadcast to kitchen display
    broadcast(`restaurant:${req.params.restaurantId}`, "new_order", payload);

    res.status(201).json(payload);
  } catch (err) {
    req.log.error(err, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /orders/:restaurantId/:orderId  — update status
router.patch("/:restaurantId/:orderId", async (req, res) => {
  const schema = z.object({ status: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [order] = await db
      .update(ordersTable)
      .set({ status: parsed.data.status })
      .where(eq(ordersTable.order_id, req.params.orderId))
      .returning();

    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const payload = toJson(order);

    // Broadcast to both kitchen and diner
    broadcast(`restaurant:${req.params.restaurantId}`, "order_updated", payload);
    broadcast(`order:${req.params.orderId}`, "status_changed", { status: payload.status });

    res.json(payload);
  } catch (err) {
    req.log.error(err, "Error updating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
