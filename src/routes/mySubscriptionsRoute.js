import { Router } from "express";
import MySubscriptionsController from "../controllers/mySubscriptionsController.js";

const route = Router();

import { auth } from "../middlewares/auth.js";

route.get("/", auth, (req, res) => {
  MySubscriptionsController.getMySubscriptions(req, res);
});

export default route;
