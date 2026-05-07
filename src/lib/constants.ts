export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  COUNTRIES: "/countries",
  TOPICS: "/topics",
  TABLES: "/tables",
  PODCASTS: "/podcasts",
  SANDBOX: "/sandbox",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",
} as const;

export const TOPIC_CATEGORIES = [
  { slug: "fundamental-rights" },
  { slug: "power-distribution" },
  { slug: "rights-justice" },
  { slug: "social-economic" },
  { slug: "civic-duties" },
  { slug: "constitutional-revision" },
] as const;
