"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ClassId } from "@/game/data/schemas";
import { createNewSave } from "@/game/engine/progression/new-game";
import { writeSave } from "@/game/engine/save/dexie-schema";
import { useGameStore } from "@/game/store/game-store";
import { useI18n } from "@/i18n";
import { getClassImage } from "@/game/utils/character-images";

const CLASS_IDS: ClassId[] = ["marauder", "inquisitor", "assassin"];

export function CharacterCreation({ onCancel }: { onCancel: () => void }) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<ClassId>("marauder");
  const [ironman, setIronman] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const hydrate = useGameStore((s) => s.hydrateFromSave);
  const t = useI18n((s) => s.t);

  const CLASSES = CLASS_IDS.map((id) => ({
    id,
    ...t.creation.classes[id],
  }));

  async function start() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const save = createNewSave(name.trim(), classId, ironman, ironman ? -2 : 0);
      await writeSave(save);
      hydrate(save);
      router.replace("/play");
    } finally {
      setBusy(false);
    }
  }

  const selected = CLASSES.find((c) => c.id === classId)!;

  return (
    <div className="fixed inset-0 z-40 bg-void-950/95 backdrop-blur overflow-y-auto">
      <div className="mx-auto max-w-5xl p-6 sm:p-10">
        <header className="text-center mb-10">
          <p className="heading-display text-xs">{t.creation.forgeYourDestiny}</p>
          <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-[0.15em] text-ash-100 mt-2">
            {t.creation.newAcolyte}
          </h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {CLASSES.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => setClassId(c.id)}
              whileHover={{ y: -4 }}
              className={`panel overflow-hidden p-5 text-left transition ${
                classId === c.id
                  ? "ring-2 ring-blood-500 shadow-sith-glow"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {/* Class portrait */}
              <div className="relative -mx-5 -mt-5 mb-5 h-52 bg-void-950 overflow-hidden">
                {/* SVG filter: makes near-white background pixels transparent */}
                <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                  <defs>
                    <filter id={`cc-clean-${c.id}`} colorInterpolationFilters="sRGB">
                      <feColorMatrix type="matrix"
                        values="1 0 0 0 0
                                0 1 0 0 0
                                0 0 1 0 0
                               -2.2 -2.2 -2.2 5 -0.1" />
                    </filter>
                  </defs>
                </svg>
                <img
                  src={getClassImage(c.id)}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-contain object-bottom select-none"
                  style={{ filter: `url(#cc-clean-${c.id}) drop-shadow(0 0 8px rgba(180,20,40,0.25))` }}
                />
                {/* Gradient fade at bottom hides foot shadows */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void-950 via-void-950/60 to-transparent" />
              </div>
              <div className="heading-display text-xs">{c.tagline}</div>
              <div className="font-display text-2xl text-ash-100 mt-1">{c.name}</div>
              <p className="text-ash-300 text-sm mt-3 leading-relaxed">{c.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.trees.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-widest border border-gilt-700/40 px-2 py-0.5 text-gilt-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </section>

        <section className="panel p-6 max-w-2xl mx-auto">
          <label className="block">
            <span className="heading-display text-xs">{t.creation.name}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder={t.creation.namePlaceholder}
              className="mt-2 w-full bg-void-900 border border-ash-500/40 focus:border-gilt-500 outline-none text-ash-100 font-display text-lg px-4 py-2 rounded-sm"
            />
          </label>

          <label className="mt-5 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ironman}
              onChange={(e) => setIronman(e.target.checked)}
              className="w-4 h-4 accent-blood-500"
            />
            <span className="text-sm">
              <span className="text-gilt-400 font-display tracking-wider uppercase">
                {t.creation.ironman}
              </span>{" "}
              <span className="text-ash-300">
                {t.creation.ironmanDesc}
              </span>
            </span>
          </label>

          <div className="mt-6 text-xs text-ash-300">
            {t.creation.selected}{" "}
            <span className="text-gilt-400">{selected.name}</span> —{" "}
            {selected.tagline}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={onCancel} className="btn-ghost flex-1">
              {t.creation.back}
            </button>
            <button
              disabled={!name.trim() || busy}
              onClick={start}
              className="btn-sith flex-1"
            >
              {busy ? t.creation.forging : t.creation.begin}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
