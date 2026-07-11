import { supabase, supabaseAuth } from "../config/supabaseClient.js";
import { calculateTrialEndUnixTimestamp } from "../helpers/calculateTrialEndUnixTimestamp.js";
import SubscriptionWebHookModel from "./SubscriptionWebHookModel.js";
import { stripe } from "../config/stripe.js";
import { getURL } from "../helpers/GetUrl.js";

const checkoutWithStripe = async ({ body, headers }) => {
  try {
    const authHeader = headers?.authorization;

    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data?.user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    const user = data.user;

    let customer;
    try {
      customer = await SubscriptionWebHookModel.createOrRetrieveCustomer({
        email: user.email,
        uuid: user.id,
      });
    } catch (error) {
      console.error("Error retrieving customer:", error);
      throw new Error("Failed to retrieve customer");
    }

    const priceId = body?.priceId;
    if (!priceId) throw new Error("Missing priceId in request body");

    const { data: price, error: priceError } = await supabase
      .from("prices")
      .select("*")
      .eq("id", priceId)
      .maybeSingle();

    if (priceError || !price) {
      console.error("Price lookup error:", priceError);
      throw new Error("Price not found");
    }

    const params = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL("app/products"),
      success_url: getURL("/payment/success"),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days),
    );

    if (price.type === "recurring") {
      Object.assign(params, {
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      });
    } else if (price.type === "one_time") {
      Object.assign(params, { mode: "payment" });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    if (session) return { sessionId: session.id, url: session.url };
    throw new Error("Unable to create checkout session.");
  } catch (error) {
    console.error("Error in checkoutWithStripe:", error);
    throw error;
  }
};

const CheckoutWithStripeModel = {
  checkout: checkoutWithStripe,
};

export default CheckoutWithStripeModel;
