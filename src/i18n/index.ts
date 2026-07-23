import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale, Translations } from "./types";
import { es } from "./es";
import { en } from "./en";
import { fr } from "./fr";
import { affixesEn, itemSetsEn, itemsEn } from "./content/items.en";
import { affixesEs, itemSetsEs, itemsEs } from "./content/items.es";
import { affixesFr, itemSetsFr, itemsFr } from "./content/items.fr";

const dictionaries: Record<Locale, Translations> = {
  es: { ...es, content: { items: itemsEs, affixes: affixesEs, itemSets: itemSetsEs } },
  en: { ...en, content: { items: itemsEn, affixes: affixesEn, itemSets: itemSetsEn } },
  fr: { ...fr, content: { items: itemsFr, affixes: affixesFr, itemSets: itemSetsFr } },
};

interface I18nStore {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = "swrott-locale";

export const useI18n = create<I18nStore>()(
  persist(
    (set) => ({
      locale: "es",
      t: dictionaries["es"],
      setLocale: (locale) => set({ locale, t: dictionaries[locale] }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = dictionaries[state.locale];
        }
      },
    },
  ),
);

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

export const LOCALES: Locale[] = ["es", "en", "fr"];
