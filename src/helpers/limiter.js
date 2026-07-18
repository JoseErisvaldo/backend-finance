import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: {
    error: "Muitas requisições, tente novamente mais tarde.",
  },
  standardHeaders: true, // headers padrão (RateLimit)
  legacyHeaders: false, // remove X-RateLimit-*
});
