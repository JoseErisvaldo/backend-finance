import Stripe from "stripe";
import SubscriptionWebHookModel from "../models/SubscriptionWebHookModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

class SubscriptionWebHookService {
  async create({ body, headers }) {
    const signature = headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log("Webhook received");
    console.log("Event raw buffer:", Buffer.isBuffer(body));

    if (!signature || !webhookSecret) {
      console.log("Missing signature or webhook secret");
      throw new Error("Missing signature or webhook secret");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.log("Signature verification failed:", err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    console.log("Received event:", event.type);

    if (!relevantEvents.has(event.type)) {
      console.log("Ignored event:", event.type);
      return { received: true };
    }

    console.log("Processing event:", event.type);

    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          console.log("Product event:", event.data.object.id);
          await SubscriptionWebHookModel.upsertProductRecord(event.data.object);
          break;

        case "product.deleted":
          console.log("Product deleted:", event.data.object.id);
          await SubscriptionWebHookModel.deleteProductRecord(event.data.object);
          break;

        case "price.created":
        case "price.updated":
          console.log("Price event:", event.data.object.id);
          await SubscriptionWebHookModel.upsertPriceRecord(event.data.object);
          break;

        case "price.deleted":
          console.log("Price deleted:", event.data.object.id);
          await SubscriptionWebHookModel.deletePriceRecord(event.data.object);
          break;

        case "checkout.session.completed":
          console.log("Checkout completed:", event.data.object.id);
          await SubscriptionWebHookModel.createOrRetrieveCustomer({
            email: event.data.object.customer_details?.email,
            uuid: event.data.object.client_reference_id,
          });

          await SubscriptionWebHookModel.manageSubscriptionStatusChange(
            event.data.object.subscription,
            event.data.object.customer,
            true,
          );
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
          console.log("Subscription event:", event.data.object.id);

          await SubscriptionWebHookModel.manageSubscriptionStatusChange(
            event.data.object.id,
            event.data.object.customer,
            event.type === "customer.subscription.created",
          );
          break;

        case "customer.subscription.deleted":
          console.log("Subscription deleted:", event.data.object.id);

          await SubscriptionWebHookModel.manageSubscriptionStatusChange(
            event.data.object.id,
            event.data.object.customer,
            false,
          );
          break;
      }
    } catch (error) {
      console.log("Handler error:", error.message);
      throw new Error(`Error handling event: ${error.message}`);
    }

    console.log("Webhook processed successfully");

    return { received: true };
  }
}

export default new SubscriptionWebHookService();
