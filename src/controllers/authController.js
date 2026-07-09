import { supabase, supabaseAuth } from "../config/supabaseClient.js";

export class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json(data.user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(200).json({
        user: data.user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
