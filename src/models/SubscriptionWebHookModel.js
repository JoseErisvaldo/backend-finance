import { stripe } from "../config/stripe.js";
import { supabase } from "../config/supabaseClient.js";

const TRIAL_PERIOD_DAYS = 0;

const upsertProductRecord = async (product) => {
  console.log("Product event received:", product.id);

  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata ?? {},
  };

  console.log("Upserting product:", product.id);

  const { error } = await supabase
    .from("products")
    .upsert(productData, { onConflict: "id" });

  if (error) {
    console.log("Product upsert error:", error.message);
    throw new Error(error.message);
  }

  console.log("Product saved:", product.id);
};

const upsertPriceRecord = async (price) => {
  console.log("Price event received:", price.id);

  const priceData = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : null,
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    description: price.nickname ?? null,
    metadata: price.metadata ?? {},
  };

  console.log("Upserting price:", price.id);

  const { error } = await supabase
    .from("prices")
    .upsert(priceData, { onConflict: "id" });

  if (error) {
    console.log("Price upsert error:", error.message);
    throw new Error(error.message);
  }

  console.log("Price saved:", price.id);
};

const deleteProductRecord = async (product) => {
  console.log("Product delete received:", product.id);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    console.log("Product delete error:", error.message);
    throw new Error(error.message);
  }

  console.log("Product deleted:", product.id);
};

const deletePriceRecord = async (price) => {
  console.log("Price delete received:", price.id);

  const { error } = await supabase.from("prices").delete().eq("id", price.id);

  if (error) {
    console.log("Price delete error:", error.message);
    throw new Error(error.message);
  }

  console.log("Price deleted:", price.id);
};

const upsertCustomer = async (uuid, stripeCustomerId) => {
  console.log("Upserting customer:", uuid, stripeCustomerId);

  const { error } = await supabase.from("customers").upsert(
    {
      id: uuid,
      stripe_customer_id: stripeCustomerId,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.log("Customer upsert error:", error.message);
    throw new Error(error.message);
  }

  console.log("Customer linked:", uuid);
};

const createCustomerInStripe = async (uuid, email) => {
  console.log("Creating Stripe customer:", email);

  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUUID: uuid,
    },
  });

  console.log("Stripe customer created:", customer.id);

  return customer.id;
};

const createOrRetrieveCustomer = async ({ email, uuid }) => {
  console.log("Checking customer:", uuid, email);

  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("id", uuid)
    .maybeSingle();

  let stripeCustomerId;

  if (existing?.stripe_customer_id) {
    console.log("Existing Stripe customer found:", existing.stripe_customer_id);

    const stripeCustomer = await stripe.customers.retrieve(
      existing.stripe_customer_id,
    );

    stripeCustomerId = stripeCustomer.id;
  } else {
    console.log("Searching Stripe customer by email");

    const list = await stripe.customers.list({ email });

    stripeCustomerId = list.data.length
      ? list.data[0].id
      : await createCustomerInStripe(uuid, email);
  }

  await upsertCustomer(uuid, stripeCustomerId);

  return stripeCustomerId;
};

const manageSubscriptionStatusChange = async (
  subscriptionId,
  customerId,
  isCreate = false,
) => {
  console.log("Subscription update:", subscriptionId, customerId);

  const { data: customerData, error } = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error) {
    console.log("Customer lookup error:", error.message);
    throw new Error(error.message);
  }

  const uuid = customerData.id;

  console.log("Linked user:", uuid);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  console.log("Stripe subscription fetched:", subscription.id);

  const subscriptionData = {
    id: subscription.id,
    user_id: uuid,
    status: subscription.status,
    metadata: subscription.metadata ?? {},
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity ?? 1,
    cancel_at_period_end: subscription.cancel_at_period_end,
    created: new Date(subscription.created * 1000),
    current_period_start: subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000)
      : new Date(subscription.created * 1000),
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : new Date(subscription.created * 1000),
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : null,
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
  };

  console.log("Upserting subscription:", subscription.id);

  const { error: upsertError } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, { onConflict: "id" });

  if (upsertError) {
    console.log("Subscription upsert error:", upsertError.message);
    throw new Error(upsertError.message);
  }

  console.log("Subscription saved:", subscription.id, "user:", uuid);
};

export default {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
