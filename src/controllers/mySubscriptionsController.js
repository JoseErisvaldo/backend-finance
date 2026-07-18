import MySubscriptionService from "../services/mySubscriptionService.js";

class MySubscriptionsController {
  async getMySubscriptions(req, res) {
    try {
      const userId = req.user.id;
      console.log("User ID:", userId);
      const subscriptions =
        await MySubscriptionService.getSubscriptionsByUserId(userId);
      return res.json(subscriptions);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}

export default new MySubscriptionsController();
