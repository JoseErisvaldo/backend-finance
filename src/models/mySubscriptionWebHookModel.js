import { supabase } from "../config/supabaseClient.js";

class MySubscriptionWebHookModel {
  async getSubscriptionsByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `
          id,
          status,
          quantity,
          cancel_at_period_end,
          created,
          current_period_start,
          current_period_end,
          ended_at,
          cancel_at,
          canceled_at,
          trial_start,
          trial_end,

          prices (
            id,
            unit_amount,
            currency,
            interval,
            interval_count,

            products (
              id,
              name,
              description,
              image
            )
          )
        `,
        )
        .eq("user_id", userId)
        .order("created", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw new Error("Failed to fetch subscriptions");
    }
  }
}

export default new MySubscriptionWebHookModel();
