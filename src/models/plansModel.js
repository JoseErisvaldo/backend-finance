import { supabase } from "../config/supabaseClient.js";

class PlansModel {
  async findAll() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          active,
          name,
          description,
          image,
          metadata,
          prices (
            id,
            active,
            description,
            unit_amount,
            currency,
            type,
            interval,
            interval_count,
            trial_period_days,
            metadata
          )
        `,
        )
        .eq("active", true)
        .eq("prices.active", true);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  }
}

export default new PlansModel();
