"use client";

import { useState, useCallback, useEffect } from "react";
import fa from "./fa.json";
import en from "./en.json";

type Locale = "fa" | "en";
type Translations = typeof fa;

const translations: Record<Locale, Translations> = { fa, en };

// Simple global state for locale
let globalLocale: Locale = "fa";
const listeners = new Set<(locale: Locale) => void>();

export function setGlobalLocale(locale: Locale) {
  globalLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }
  listeners.forEach((fn) => fn(locale));
}

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(globalLocale);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "fa" || saved === "en")) {
      globalLocale = saved;
      setLocale(saved);
    }
    const listener = (l: Locale) => setLocale(l);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: any = translations[locale];
      for (const k of keys) {
        if (value == null) return key;
        value = value[k];
      }
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.join("\n");
      return key;
    },
    [locale]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const keys = key.split(".");
      let value: any = translations[locale];
      for (const k of keys) {
        if (value == null) return [];
        value = value[k];
      }
      if (Array.isArray(value)) return value;
      return [];
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    const next = locale === "fa" ? "en" : "fa";
    setGlobalLocale(next);
  }, [locale]);

  return { t, tArray, locale, toggleLocale };
}
