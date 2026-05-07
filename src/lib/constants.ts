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
  {
    slug: "fundamental-rights",
    name: { fa: "حقوق بنیادین", en: "Fundamental Rights" },
  },
  {
    slug: "power-distribution",
    name: { fa: "قدرت و توزیع", en: "Power & Distribution" },
  },
  {
    slug: "rights-justice",
    name: { fa: "حقوق و عدالت", en: "Rights & Justice" },
  },
  {
    slug: "social-economic",
    name: { fa: "اجتماعی-اقتصادی", en: "Social & Economic" },
  },
  {
    slug: "civic-duties",
    name: { fa: "وظایف مدنی", en: "Civic Duties" },
  },
  {
    slug: "constitutional-revision",
    name: { fa: "بازنگری قانون اساسی", en: "Constitutional Revision" },
  },
] as const;
