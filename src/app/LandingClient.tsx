"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IntroCinematic } from "@/game/ui/intro/IntroCinematic";
import { KorribanExteriorScene } from "@/game/scenes/korriban/KorribanExterior";
import { Particles } from "@/game/scenes/particles/Particles";
import { audioManager } from "@/game/audio/audio-manager";
import { useI18n, LOCALES, LOCALE_LABELS } from "@/i18n";

type Stage = "cinematic" | "menu";

const SEEN_KEY = "swrott-intro-seen";

export function LandingClient() {
  const [stage, setStage] = useState<Stage | null>(null);
  const t = useI18n((s) => s.t);
  const locale = useI18n((s) => s.locale);
  const setLocale = useI18n((s) => s.setLocale);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY);
    setStage(seen ? "menu" : "cinematic");
  }, []);

  function onIntroDone() {
    localStorage.setItem(SEEN_KEY, "1");
    setStage("menu");
    // Same track the cinematic started — no-op if already playing, so the
    // theme carries over without a cut.
    void audioManager.playMusic("theme_main", 2400);
  }

  if (stage === null) return null;

  return (
    <>
      {/* Illustrated backdrop with a slow cinematic push-in */}
      <AnimatePresence>
        {stage === "menu" && (
          <motion.div
            key="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="menu-kenburns absolute inset-0">
              <KorribanExteriorScene />
            </div>
            {/* Embers drifting up over the scene */}
            <div className="pointer-events-none absolute inset-0">
              <Particles preset="embers" count={26} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic intro */}
      <AnimatePresence>
        {stage === "cinematic" && (
          <IntroCinematic key="cinematic" onComplete={onIntroDone} />
        )}
      </AnimatePresence>

      {/* Main menu */}
      <AnimatePresence>
        {stage === "menu" && (
          <motion.main
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center"
          >
            {/* Readability gradients — darker at top and bottom, scene shows mid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(5,5,10,0.35)_0%,_rgba(5,5,10,0.82)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-7">
              {/* Era line */}
              <motion.p
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="heading-display text-xs sm:text-sm animate-flicker"
              >
                {t.landing.era}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20, letterSpacing: "0.3em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
                transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tight"
              >
                <span className="block text-ash-100 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                  {t.landing.riseOfThe}
                </span>
                <span
                  className="title-sheen mt-1 block bg-clip-text text-transparent drop-shadow-[0_0_36px_rgba(196,30,58,0.5)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, #7a0a14 0%, #c41e3a 32%, #ffd9a0 50%, #c41e3a 68%, #7a0a14 100%)",
                  }}
                >
                  {t.landing.triumvirate}
                </span>
              </motion.h1>

              {/* Saber ignition divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[3px] w-64 sm:w-96"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #ff4d5e 18%, #ffd9d9 50%, #ff4d5e 82%, transparent)",
                    boxShadow:
                      "0 0 12px rgba(255,60,80,0.9), 0 0 32px rgba(196,30,58,0.6)",
                  }}
                />
                {/* Hilt nub at center */}
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gilt-500 shadow-[0_0_8px_rgba(201,169,97,0.9)]" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="max-w-2xl text-ash-200 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                {t.landing.tagline}
              </motion.p>

              {/* Primary actions */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.85 }}
                className="mt-2 flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row sm:gap-4"
              >
                <MenuLink href="/play" primary>
                  {t.landing.newGame}
                </MenuLink>
                <MenuLink href="/play?continue=1">{t.landing.continue}</MenuLink>
              </motion.div>

              {/* Utility row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.15 }}
                className="flex items-center gap-3 text-xs text-ash-400"
              >
                <button
                  onClick={() => {
                    localStorage.removeItem(SEEN_KEY);
                    setStage("cinematic");
                    // The theme keeps playing — the cinematic shares it.
                  }}
                  className="transition hover:text-gilt-400"
                >
                  {t.landing.replayIntro}
                </button>
                <Ornament />
                <Link href="/options" className="transition hover:text-gilt-400">
                  {t.landing.options}
                </Link>
                <Ornament />
                <Link href="/credits" className="transition hover:text-gilt-400">
                  {t.landing.credits}
                </Link>
                <Ornament />
                <LanguageSelector locale={locale} setLocale={setLocale} />
              </motion.div>
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-ash-600">
              {t.landing.version}
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

function Ornament() {
  return <span className="text-[8px] text-gilt-700">◆</span>;
}

function MenuLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={() => audioManager.click()}
      onMouseEnter={() => audioManager.hover()}
      className={`group relative flex-1 overflow-hidden rounded-sm border px-6 py-3.5 font-display text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
        primary
          ? "border-blood-500/60 bg-gradient-to-b from-blood-800/80 to-blood-950/90 text-ash-100 hover:border-blood-400 hover:shadow-[0_0_24px_rgba(196,30,58,0.45)]"
          : "border-ash-500/30 bg-void-900/70 text-ash-200 backdrop-blur-sm hover:border-gilt-500/60 hover:text-gilt-300 hover:shadow-[0_0_18px_rgba(201,169,97,0.25)]"
      }`}
    >
      {/* Sweeping highlight on hover */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
      />
      {/* Corner ticks */}
      <span className={`pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t ${primary ? "border-gilt-500/70" : "border-ash-500/40"}`} />
      <span className={`pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r ${primary ? "border-gilt-500/70" : "border-ash-500/40"}`} />
      {children}
    </Link>
  );
}

function LanguageSelector({
  locale,
  setLocale,
}: {
  locale: string;
  setLocale: (l: "es" | "en" | "fr") => void;
}) {
  return (
    <span className="inline-flex gap-1.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`transition ${
            locale === l ? "text-gilt-400" : "hover:text-gilt-400"
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </span>
  );
}
