import express from "express";
import cors from "cors";
import subscriptionsWebHookRoute from "./routes/subscriptionsWebHook.js";
import plansRoute from "./routes/plans.js";
import authRoutes from "./routes/authRoutes.js";
import checkoutWithStripeRoute from "./routes/checkoutWithStripeRoute.js";
import mySubscriptionsRoute from "./routes/mySubscriptionsRoute.js";
import homeRoute from "./routes/home.js";
import { limiter } from "./helpers/limiter.js";

const app = express();

app.use("/webhook", subscriptionsWebHookRoute);

app.use("/", homeRoute);

// Enable CORS for the frontend during development
app.use(
  cors({
    origin: ["http://localhost:5173", "https://app-finance-swart.vercel.app"],
    credentials: true,
  }),
);
app.use(limiter);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/plans", plansRoute);
app.use("/checkoutWithStripe", checkoutWithStripeRoute);
app.use("/mySubscriptions", mySubscriptionsRoute);

export default app;
