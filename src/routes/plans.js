import { Router } from "express";
import PlansController from "../controllers/plansController.js";

const router = Router();

router.get("/", async (req, res) => {
  PlansController.getPlans(req, res);
});

export default router;
