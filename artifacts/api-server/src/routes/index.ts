import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import analyticsRouter from "./analytics";
import authRouter from "./auth";
import aiRouter from "./ai";
import tablesRouter from "./tables";
import sseRouter from "./sse";
import loyaltyRouter from "./loyalty";
import ratingsRouter from "./ratings";
import promoRouter from "./promo";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/menu", menuRouter);
router.use("/orders", ordersRouter);
router.use("/analytics", analyticsRouter);
router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/tables", tablesRouter);
router.use("/sse", sseRouter);
router.use("/loyalty", loyaltyRouter);
router.use("/ratings", ratingsRouter);
router.use("/promo", promoRouter);

export default router;
