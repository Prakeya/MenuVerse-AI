import { Router } from "express";
import { z } from "zod/v4";

const router = Router();

const PROMO_CODES: Record<string, { discount_pct: number; message: string }> = {
  WELCOME10: { discount_pct: 10, message: "10% off your first order — welcome! 🎉" },
  TASTE25:   { discount_pct: 25, message: "25% off — enjoy the flavours! 🍽️" },
  CHEF50:    { discount_pct: 50, message: "50% off — courtesy of the chef! 👨‍🍳" },
  LOYAL20:   { discount_pct: 20, message: "20% off for loyal guests — thank you! ❤️" },
};

// POST /promo/validate
router.post("/validate", (req, res) => {
  const schema = z.object({ code: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const promo = PROMO_CODES[parsed.data.code.toUpperCase().trim()];
  if (!promo) {
    res.json({ valid: false, message: "Invalid promo code" });
    return;
  }
  res.json({ valid: true, ...promo });
});

export default router;
