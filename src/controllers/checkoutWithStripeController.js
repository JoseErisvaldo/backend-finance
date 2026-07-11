import CheckoutWithStripeService from "../services/checkoutWithStripeService.js";

class CheckoutWithStripeController {
  async checkout(req, res) {
    try {
      const result = await CheckoutWithStripeService.checkout({
        body: req.body,
        headers: req.headers,
      });

      return res.json(result);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}
export default new CheckoutWithStripeController();
