import express from "express";
import cors from "cors";
import subscriptionsWebHookRoute from "./routes/subscriptionsWebHook.js";
import plansRoute from "./routes/plans.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use("/webhook", subscriptionsWebHookRoute);

// Enable CORS for the frontend during development
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/plans", plansRoute);

export default app;
