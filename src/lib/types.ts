export interface LocalizedString {
  fa: string;
  en: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Author {
  name: string;
  bio: string;
  imageUrl?: string;
}

export interface Amendment {
  year: number;
  description: LocalizedString;
}

export interface ReligiousComposition {
  religion: string;
  percentage: number;
}

export interface Country {
  id: string;
  slug: string;
  name: LocalizedString;
  flag: string;
  population: number;
  coordinates: Coordinates;
  abstract: LocalizedString;
  authors: Author[];
  amendments: Amendment[];
  podcastUrl?: string;
  videoUrl?: string;
  countryCode: string;
  systemOfGovernment?: string;
  hdi?: number;
  independenceDate?: string;
  officialLanguages?: string[];
  gdp?: string;
  economicType?: string;
  religiousComposition?: ReligiousComposition[];
  urbanizationRate?: number;
  corruptionIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Constitution {
  id: string;
  countryId: string;
  fullTextUrl: string;
  chapters: Chapter[];
  createdAt: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: LocalizedString;
  order: number;
  articles: Article[];
}

export interface Article {
  id: string;
  number: number;
  title?: LocalizedString;
  order: number;
  clauses: Clause[];
}

export interface Clause {
  id: string;
  number: number;
  text: LocalizedString;
  topicSlugs: string[];
  agreeCount: number;
  disagreeCount: number;
  order: number;
  countryId: string;
  articleId: string;
}

export interface Comment {
  id: string;
  clauseId: string;
  userId: string;
  userName: string;
  content: string;
  parentId?: string;
  status: "pending" | "approved" | "rejected";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  clauseId: string;
  userId: string;
  type: "agree" | "disagree";
  createdAt: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: LocalizedString;
  category: string;
  description: LocalizedString;
  order: number;
}

export interface TimelineEvent {
  id: string;
  countryId: string;
  date: string;
  title: LocalizedString;
  description: LocalizedString;
  order: number;
}

export interface PlatformStats {
  totalCountries: number;
  totalClauses: number;
  totalVotes: number;
  totalComments: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}
