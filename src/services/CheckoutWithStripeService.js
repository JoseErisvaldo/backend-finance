import CheckoutWithStripeModel from "../models/CheckoutWithStripeModel.js";

class CheckoutWithStripeService {
  async checkout({ body, headers }) {
    const result = await CheckoutWithStripeModel.checkout({
      body,
      headers,
    });
    return result;
  }
}

export default new CheckoutWithStripeService();
