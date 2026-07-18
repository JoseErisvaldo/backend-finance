import MySubscriptionWebHookModel from "../models/mySubscriptionWebHookModel.js";

class MySubscriptionService {
  async getSubscriptionsByUserId(userId) {
    try {
      const subscriptions =
        await MySubscriptionWebHookModel.getSubscriptionsByUserId(userId);
      return subscriptions;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw new Error("Failed to fetch subscriptions");
    }
  }
}

export default new MySubscriptionService();
