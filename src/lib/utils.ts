import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LocalizedString } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localized(
  str: LocalizedString | undefined,
  locale: string = "fa",
): string {
  if (!str) return "";
  return locale === "en" ? str.en : str.fa;
}

export function formatNumber(num: number, locale: string = "fa"): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(num);
}

export function formatDate(date: string, locale: string = "fa"): string {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
