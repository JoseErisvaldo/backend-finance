import express from "express";
import subscriptionsWebHookRoute from "./routes/subscriptionsWebHook.js";
import plansRoute from "./routes/plans.js";

const app = express();

app.use("/webhook", subscriptionsWebHookRoute);

app.use(express.json());

app.use("/plans", plansRoute);

export default app;
