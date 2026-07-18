import Stripe from "stripe";

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.error("Missing STRIPE_SECRET_KEY. Stripe features will be disabled.");
}

export { stripe };
