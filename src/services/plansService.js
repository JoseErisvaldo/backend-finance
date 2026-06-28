import PlansModel from "../models/plansModel.js";

class PlansService {
  async getAllPlans() {
    try {
      const plans = await PlansModel.findAll();
      return plans;
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }
}

export default new PlansService();
