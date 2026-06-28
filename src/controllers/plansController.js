import PlansService from "../services/PlansService.js";

class PlansController {
  async getPlans(req, res) {
    try {
      const plans = await PlansService.getAllPlans();
      return res.json(plans);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
}

export default new PlansController();
