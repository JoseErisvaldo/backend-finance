import CheckoutWithStripeModel from "../models/checkoutWithStripeModel.js";

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
