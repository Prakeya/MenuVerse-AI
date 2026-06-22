import { Router } from "express";
import { subscribe, unsubscribe } from "../lib/sseHub";

const router = Router();

// GET /sse/restaurant/:restaurantId  — kitchen display stream
router.get("/restaurant/:restaurantId", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const channel = `restaurant:${req.params.restaurantId}`;
  subscribe(channel, res);

  // heartbeat every 25s to keep connection alive
  const hb = setInterval(() => {
    try { res.write(": heartbeat\n\n"); } catch { clearInterval(hb); }
  }, 25_000);

  req.on("close", () => {
    clearInterval(hb);
    unsubscribe(channel, res);
  });
});

// GET /sse/order/:orderId  — diner order tracking stream
router.get("/order/:orderId", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const channel = `order:${req.params.orderId}`;
  subscribe(channel, res);

  const hb = setInterval(() => {
    try { res.write(": heartbeat\n\n"); } catch { clearInterval(hb); }
  }, 25_000);

  req.on("close", () => {
    clearInterval(hb);
    unsubscribe(channel, res);
  });
});

export default router;
