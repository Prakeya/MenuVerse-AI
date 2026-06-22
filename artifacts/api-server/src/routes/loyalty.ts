import { Router } from "express";
import { db } from "@workspace/db";
import { loyaltyProfilesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

const toJson = (p: typeof loyaltyProfilesTable.$inferSelect) => ({
  profile_id: p.profile_id,
  restaurant_id: p.restaurant_id,
  phone: p.phone,
  name: p.name ?? null,
  visit_count: p.visit_count,
  total_spent: Number(p.total_spent),
  last_visit: p.last_visit?.toISOString() ?? null,
  created_at: p.created_at?.toISOString() ?? null,
});

// POST /loyalty/identify  — get-or-create profile, bump visit count
router.post("/identify", async (req, res) => {
  const schema = z.object({
    phone: z.string().min(6),
    restaurantId: z.string(),
    name: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const { phone, restaurantId, name } = parsed.data;
  try {
    const [existing] = await db
      .select()
      .from(loyaltyProfilesTable)
      .where(and(eq(loyaltyProfilesTable.restaurant_id, restaurantId), eq(loyaltyProfilesTable.phone, phone)));

    if (existing) {
      const [updated] = await db
        .update(loyaltyProfilesTable)
        .set({
          visit_count: sql`${loyaltyProfilesTable.visit_count} + 1`,
          last_visit: new Date(),
          ...(name && !existing.name ? { name } : {}),
        })
        .where(eq(loyaltyProfilesTable.profile_id, existing.profile_id))
        .returning();
      res.json({ profile: toJson(updated), returning: true });
    } else {
      const [created] = await db
        .insert(loyaltyProfilesTable)
        .values({ restaurant_id: restaurantId, phone, name: name ?? null, visit_count: 1, last_visit: new Date() })
        .returning();
      res.status(201).json({ profile: toJson(created), returning: false });
    }
  } catch (err) {
    req.log.error(err, "Error identifying loyalty profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /loyalty/:restaurantId/:phone
router.get("/:restaurantId/:phone", async (req, res) => {
  try {
    const [profile] = await db
      .select()
      .from(loyaltyProfilesTable)
      .where(and(
        eq(loyaltyProfilesTable.restaurant_id, req.params.restaurantId),
        eq(loyaltyProfilesTable.phone, req.params.phone),
      ));
    if (!profile) { res.status(404).json({ error: "Not found" }); return; }
    res.json(toJson(profile));
  } catch (err) {
    req.log.error(err, "Error fetching loyalty profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /loyalty/spend  — record spend after order
router.post("/spend", async (req, res) => {
  const schema = z.object({ phone: z.string(), restaurantId: z.string(), amount: z.number() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const { phone, restaurantId, amount } = parsed.data;
  try {
    await db
      .update(loyaltyProfilesTable)
      .set({ total_spent: sql`${loyaltyProfilesTable.total_spent} + ${String(amount)}` })
      .where(and(
        eq(loyaltyProfilesTable.restaurant_id, restaurantId),
        eq(loyaltyProfilesTable.phone, phone),
      ));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Error recording spend");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /loyalty/leaderboard/:restaurantId  — top customers
router.get("/leaderboard/:restaurantId", async (req, res) => {
  try {
    const profiles = await db
      .select()
      .from(loyaltyProfilesTable)
      .where(eq(loyaltyProfilesTable.restaurant_id, req.params.restaurantId))
      .orderBy(sql`${loyaltyProfilesTable.total_spent} DESC`)
      .limit(10);
    res.json(profiles.map(toJson));
  } catch (err) {
    req.log.error(err, "Error fetching leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
