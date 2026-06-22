import { Router } from "express";
import { db } from "@workspace/db";
import { ratingsTable } from "@workspace/db";
import { eq, avg, count } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

// GET /ratings/:restaurantId  — avg rating per item
router.get("/:restaurantId", async (req, res) => {
  try {
    const rows = await db
      .select({
        item_id: ratingsTable.item_id,
        avg_rating: avg(ratingsTable.rating),
        count: count(),
      })
      .from(ratingsTable)
      .where(eq(ratingsTable.restaurant_id, req.params.restaurantId))
      .groupBy(ratingsTable.item_id);

    res.json(rows.map((r) => ({
      item_id: r.item_id,
      avg_rating: r.avg_rating ? Number(Number(r.avg_rating).toFixed(1)) : null,
      count: r.count,
    })));
  } catch (err) {
    req.log.error(err, "Error fetching ratings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /ratings/:restaurantId  — submit ratings for one or more items
router.post("/:restaurantId", async (req, res) => {
  const itemSchema = z.object({
    item_id: z.string(),
    rating: z.number().int().min(1).max(5),
    phone: z.string().optional(),
  });
  const schema = z.object({ ratings: z.array(itemSchema) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  try {
    await db.insert(ratingsTable).values(
      parsed.data.ratings.map((r) => ({
        restaurant_id: req.params.restaurantId,
        item_id: r.item_id,
        rating: r.rating,
        phone: r.phone ?? null,
      }))
    );
    res.status(201).json({ ok: true, count: parsed.data.ratings.length });
  } catch (err) {
    req.log.error(err, "Error submitting ratings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
