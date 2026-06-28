import express from "express";
import { Router } from "express";
import SubscriptionWebHookService from "../services/SubscriptionWebHookService.js";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const result = await SubscriptionWebHookService.create({
        body: req.body,
        headers: req.headers,
      });

      return res.json(result);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  },
);

export default router;
