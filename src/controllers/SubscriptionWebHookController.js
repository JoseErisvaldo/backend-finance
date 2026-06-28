import SubscriptionWebHookService from "../services/SubscriptionWebHookService.js";

class SubscriptionWebHookController {
  async create(req, res) {
    try {
      const response = await SubscriptionWebHookService.create(
        req.body,
        req.headers,
        res,
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
export default new SubscriptionWebHookController();
