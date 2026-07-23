"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n";

export function LangSync() {
  const locale = useI18n((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
