import { Router } from "express";
import CheckoutWithStripeController from "../controllers/checkoutWithStripeController.js";

const router = Router();

router.post("/", (req, res) => {
  CheckoutWithStripeController.checkout(req, res);
});

export default router;
