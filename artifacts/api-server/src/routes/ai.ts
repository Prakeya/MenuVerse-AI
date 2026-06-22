import { Router } from "express";
import { z } from "zod/v4";
import { db } from "@workspace/db";
import { menuItemsTable, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DESCRIBE_TEMPLATES = [
  (name: string, _cat: string) =>
    `A beautifully crafted ${name.toLowerCase()}, prepared with the finest ingredients and served fresh to delight every palate.`,
  (name: string, _cat: string) =>
    `Our signature ${name.toLowerCase()} — expertly seasoned and perfectly balanced, delivering an unforgettable dining experience.`,
  (name: string, _cat: string) =>
    `Indulge in our ${name.toLowerCase()}, a crowd favourite made with premium ingredients and chef's expertise.`,
  (name: string, cat: string) =>
    `Discover the rich flavours of our ${name.toLowerCase()}, a classic ${cat.toLowerCase() || "dish"} elevated to perfection.`,
];

// POST /ai/describe
router.post("/describe", (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    category: z.string().optional().default("dish"),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }
  const { name, category } = parsed.data;
  const fn = DESCRIBE_TEMPLATES[Math.floor(Math.random() * DESCRIBE_TEMPLATES.length)];
  res.json({ description: fn(name, category) });
});

// POST /ai/chat — AI Waiter (menu-aware rule engine)
router.post("/chat", async (req, res) => {
  const schema = z.object({
    restaurantId: z.string().min(1),
    message: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }
  const { restaurantId, message } = parsed.data;

  try {
    const menu = await db.select().from(menuItemsTable).where(eq(menuItemsTable.restaurant_id, restaurantId));
    const available = menu.filter((m) => m.available);
    const msg = message.toLowerCase();
    let reply = "";

    if (/vegetarian|veg\b|veggie|no meat|meatless/i.test(msg)) {
      const vegItems = available.filter((m) =>
        /veg|salad|paneer|dal|tofu|garden|plant|mushroom/i.test(m.category + " " + m.name)
      );
      const picks = vegItems.length ? vegItems : available.slice(0, 3);
      reply = `We have great vegetarian options! Try ${picks.slice(0, 3).map((m) => `**${m.name}** (₹${Number(m.price).toFixed(0)})`).join(", ")}. All freshly prepared!`;
    } else if (/recommend|best|popular|favourite|must.try|what.*good|what.*order/i.test(msg)) {
      const picks = available.slice(0, 3);
      reply = picks.length
        ? `Our top picks today: ${picks.map((m) => `**${m.name}** (₹${Number(m.price).toFixed(0)})`).join(", ")}. Each one is chef-approved!`
        : "Our entire menu is freshly prepared daily — you can't go wrong with any dish!";
    } else if (/dessert|sweet|cake|ice cream|pudding/i.test(msg)) {
      const desserts = available.filter((m) =>
        /dessert|sweet|cake|ice.cream|pudding|chocolate|gulab|halwa/i.test(m.category + " " + m.name)
      );
      reply = desserts.length
        ? `For desserts: ${desserts.map((m) => `**${m.name}** (₹${Number(m.price).toFixed(0)})`).join(", ")}. The perfect finale to your meal!`
        : "Ask your server about today's dessert specials — our pastry chef prepares them fresh daily!";
    } else if (/drink|beverage|juice|water|tea|coffee|lassi|shake/i.test(msg)) {
      const drinks = available.filter((m) =>
        /drink|beverage|juice|water|tea|coffee|lassi|shake|soda|chai/i.test(m.category + " " + m.name)
      );
      reply = drinks.length
        ? `Our drinks menu: ${drinks.map((m) => `**${m.name}** (₹${Number(m.price).toFixed(0)})`).join(", ")}.`
        : "We have a range of fresh juices, teas, and soft drinks — ask your server for today's selection!";
    } else if (/allerg|nut|dairy|gluten|peanut|shellfish/i.test(msg)) {
      reply = "Your health is our priority! Please inform your server about any allergies and they'll guide you to the safest choices. We take all dietary requirements very seriously.";
    } else if (/price|cheap|budget|expensive|affordable|cost/i.test(msg)) {
      const prices = available.map((m) => Number(m.price)).sort((a, b) => a - b);
      if (prices.length) {
        const cheapest = available.find((m) => Number(m.price) === prices[0]);
        reply = `Our menu ranges from ₹${prices[0].toFixed(0)} to ₹${prices[prices.length - 1].toFixed(0)}. Our most affordable dish is **${cheapest?.name}** at ₹${prices[0].toFixed(0)}.`;
      }
    } else if (/time|wait|how long|prep|ready|minutes/i.test(msg)) {
      reply = "Most dishes are ready in 15–25 minutes. We'll keep you updated as your order is being prepared — thank you for your patience!";
    } else if (/spicy|hot|mild|not spicy|spice/i.test(msg)) {
      reply = "We can adjust the spice level for most dishes! Tell your server — mild, medium, or fiery hot — and our chefs will make it just right.";
    } else if (/hello|hi\b|hey|good morning|good evening|good afternoon/i.test(msg)) {
      reply = `Welcome! I'm your AI waiter 🍽️ We have ${available.length} dishes available today. I can help with recommendations, dietary needs, pricing, or anything about our menu. What can I get you?`;
    } else {
      const match = available.find((m) => {
        const nameParts = m.name.toLowerCase().split(" ");
        return nameParts.some((part: string) => part.length > 3 && msg.includes(part));
      });
      if (match) {
        reply = `**${match.name}** is a wonderful choice! ${match.description ?? "Freshly prepared by our chef."} Priced at ₹${Number(match.price).toFixed(0)}. ${match.available ? "Available right now!" : "Unfortunately sold out today."}`;
      } else {
        reply = `I'm here to help! Ask me about:\n• Dish recommendations\n• Vegetarian options\n• Allergens & dietary needs\n• Pricing\n• Preparation time\n\nWe have **${available.length} dishes** ready for you today!`;
      }
    }

    res.json({ reply });
  } catch {
    res.json({ reply: "I'm having a moment — please ask your server directly and they'll be happy to help!" });
  }
});

// POST /ai/import — Parse text menu and create real DB entries
router.post("/import", async (req, res) => {
  const schema = z.object({
    restaurantId: z.string().min(1),
    text: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }
  const { restaurantId, text } = parsed.data;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentCategory = "Mains";
  const dishes: Array<{ name: string; price: number; category: string; description: string }> = [];

  for (const line of lines) {
    const isCategoryHeader =
      /^[A-Z][A-Z\s&']+$/.test(line) ||
      (/^[A-Za-z\s&']+:?\s*$/.test(line) && !/[\d₹$]/.test(line) && line.length < 30);

    if (isCategoryHeader) {
      currentCategory = line.replace(/:$/, "").trim();
      continue;
    }

    const priceMatch =
      line.match(/^(.+?)\s*[-–—]\s*[₹$]?\s*([\d,]+(?:\.\d{1,2})?)\s*$/) ||
      line.match(/^(.+?)\s+[₹$]([\d,]+(?:\.\d{1,2})?)\s*$/) ||
      line.match(/^(.+?)\s+([\d,]+(?:\.\d{1,2})?)\s*$/);

    if (priceMatch) {
      const name = priceMatch[1].trim();
      const price = parseFloat(priceMatch[2].replace(",", "")) || 0;
      if (name.length > 2 && price > 0) {
        const fn = DESCRIBE_TEMPLATES[Math.floor(Math.random() * DESCRIBE_TEMPLATES.length)];
        dishes.push({ name, price, category: currentCategory, description: fn(name, currentCategory) });
      }
    }
  }

  if (dishes.length > 0) {
    await db.insert(menuItemsTable).values(
      dishes.map((d) => ({
        restaurant_id: restaurantId,
        name: d.name,
        price: d.price.toFixed(2),
        category: d.category,
        description: d.description,
        available: true,
        image_url: null,
      }))
    );
  }

  res.json({ imported: dishes.length, dishes });
});

// GET /ai/copilot/:restaurantId — AI Revenue Copilot insights
router.get("/copilot/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const menu = await db.select().from(menuItemsTable).where(eq(menuItemsTable.restaurant_id, restaurantId));
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.restaurant_id, restaurantId));

    const available = menu.filter((m) => m.available).length;
    const soldOut = menu.filter((m) => !m.available).length;
    const totalRevenue = orders.reduce((s, o) => s + (Number(o.amount) || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const insights = [];
    if (soldOut > 0) insights.push({ icon: "AlertTriangle", title: `${soldOut} Item${soldOut > 1 ? "s" : ""} Unavailable`, desc: `Restock ${soldOut} dish${soldOut > 1 ? "es" : ""} to avoid lost sales.`, priority: "high" });
    if (avgOrderValue > 0) insights.push({ icon: "TrendingUp", title: `₹${avgOrderValue.toFixed(0)} Avg. Order Value`, desc: "Offer combo deals to push this 15% higher.", priority: "medium" });
    if (menu.length < 12) insights.push({ icon: "Plus", title: "Expand Your Menu", desc: `${menu.length} dishes listed. Restaurants with 12+ see 30% more orders.`, priority: "medium" });
    insights.push({ icon: "QrCode", title: "QR Code on Every Table", desc: "Table QR codes increase reorder rate by 22%.", priority: "low" });
    insights.push({ icon: "Star", title: "AI Dish Descriptions", desc: "Rich descriptions drive 2× more add-to-cart clicks.", priority: "low" });
    if (orders.length === 0) insights.push({ icon: "Lightbulb", title: "Share Your Menu Link", desc: "No orders yet — share your QR or menu link to get started!", priority: "high" });

    res.json({ stats: { total: menu.length, available, soldOut, orders: orders.length, revenue: totalRevenue, avgOrderValue }, insights });
  } catch {
    res.json({ stats: {}, insights: [] });
  }
});

export default router;
