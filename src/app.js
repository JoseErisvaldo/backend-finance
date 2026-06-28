import express from "express";
import subscriptionsWebHookRoute from "./routes/subscriptionsWebHook.js";

const app = express();

// ❌ NÃO global json antes de tudo
app.use("/webhook", subscriptionsWebHookRoute);

// ✅ depois sim JSON para o resto da API
app.use(express.json());

export default app;
