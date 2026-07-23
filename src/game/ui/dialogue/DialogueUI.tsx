"use client";

import { useDialogueStore } from "@/game/engine/dialogue/dialogue-store";
import { useAudio } from "@/game/audio/use-audio";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import type { DialogueContext } from "@/game/engine/dialogue/dialogue-types";
import { getSpeakerImage } from "@/game/utils/character-images";
import { getSithRank } from "@/game/engine/progression/rank";
import { useGameStore } from "@/game/store/game-store";

/** Replace {name}/{rank}/{title}/{class} tokens so NPCs address you by your
 *  evolving Sith standing — makes the world feel reactive across all dialogue. */
function applyTokens(text: string, tok: Record<string, string>): string {
  return text.replace(/\{(name|rank|title|class)\}/g, (_, k) => tok[k] ?? `{${k}}`);
}

const TONE_COLORS: Record<string, string> = {
  neutral: "text-ash-200 hover:text-ash-50",
  dark: "text-blood-400 hover:text-blood-300",
  light: "text-force-400 hover:text-force-300",
  aggressive: "text-gilt-400 hover:text-gilt-300",
  deceptive: "text-purple-400 hover:text-purple-300",
};

const TONE_BORDERS: Record<string, string> = {
  neutral: "border-ash-600/30 hover:border-ash-400/60",
  dark: "border-blood-700/40 hover:border-blood-500/70",
  light: "border-force-700/40 hover:border-force-500/70",
  aggressive: "border-gilt-700/40 hover:border-gilt-500/70",
  deceptive: "border-purple-700/40 hover:border-purple-500/70",
};

/**
 * Cinematic dialogue overlay with NPC silhouette panel.
 * Shows speaker on the left, scrolling text on the right, response options below.
 */
export function DialogueUI({ ctx }: { ctx: DialogueContext }) {
  const active = useDialogueStore((s) => s.active);
  const currentNode = useDialogueStore((s) => s.currentNode);
  const availableOptions = useDialogueStore((s) => s.availableOptions);
  const selectOption = useDialogueStore((s) => s.selectOption);
  const advanceAutoNode = useDialogueStore((s) => s.advanceAutoNode);
  const endConversation = useDialogueStore((s) => s.endConversation);
  const playerName = useGameStore((s) => s.character?.name ?? "Acolyte");
  const audio = useAudio();

  // Identity tokens so NPC lines can address you by your evolving rank.
  const rank = getSithRank(ctx.playerClassId, ctx.playerLevel, ctx.primary.corruption);
  const tokens = { name: playerName, rank: rank.rank, title: rank.title, class: ctx.playerClassId };

  // Esc walks away from the conversation (re-openable later). The dialogue is a
  // top-level overlay, not a HUD panel, so the panel Esc handlers never reached it.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        endConversation();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, endConversation]);

  // Frame counter for NPC silhouette breathing
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      setFrame((f) => f + 1);
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, [active]);

  const handleOptionClick = useCallback(
    (optionId: string) => {
      audio.dialogueAdvance();
      selectOption(optionId, ctx);
    },
    [selectOption, ctx, audio],
  );

  const handleAutoAdvance = useCallback(() => {
    audio.dialogueAdvance();
    advanceAutoNode(ctx);
  }, [advanceAutoNode, ctx, audio]);

  if (!active || !currentNode) return null;

  const hasOptions = availableOptions.length > 0;
  const isAutoAdvance = !hasOptions && currentNode.autoNext !== undefined;
  const speakerName = currentNode.speaker ?? "Narrador";
  const speakerKind = classifySpeaker(speakerName);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 70% at 25% 70%, rgba(120,20,40,0.18) 0%, transparent 60%)",
      }} />

      {/* Main dialogue card */}
      <motion.div
        className="relative w-full max-w-5xl p-4 sm:p-6 pb-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
      >
        <div className="relative rounded-sm border border-gilt-600/25 bg-void-950/85 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          {/* Decorative top accent */}
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-gilt-500/40 to-transparent" />

          {/* Leave the conversation (also bound to Esc) */}
          <button
            type="button"
            onClick={() => { audio.dialogueAdvance(); endConversation(); }}
            title="Leave conversation (Esc)"
            className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-sm border border-ash-700/40 bg-void-950/70 px-2 py-0.5 text-[9px] uppercase tracking-widest text-ash-400 hover:text-gilt-300 hover:border-gilt-600/50 transition"
          >
            Esc ✕
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left: NPC silhouette + speaker plate */}
            <div className="relative w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-ash-700/30 overflow-hidden">
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(20,8,16,0.6) 0%, rgba(8,4,10,0.9) 100%)",
              }} />
              <div className="relative flex flex-col items-center pt-6 pb-2 h-full min-h-[200px]">
                <SpeakerSilhouette kind={speakerKind} frame={frame} imageUrl={getSpeakerImage(speakerName)} />
                <div className="mt-auto pt-3 w-full px-3 text-center">
                  <div className="font-display text-base text-gilt-400 tracking-wide truncate">
                    {speakerName}
                  </div>
                  <div className="mx-auto mt-1 h-px w-12 bg-gilt-600/40" />
                </div>
              </div>
            </div>

            {/* Right: Text + options */}
            <div className="flex-1 p-5 sm:p-6 min-h-[200px] flex flex-col">
              {/* Dialogue text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentNode.id}
                  className="text-ash-100 text-sm sm:text-[15px] leading-relaxed mb-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {applyTokens(currentNode.text, tokens)}
                </motion.p>
              </AnimatePresence>

              {/* Response options */}
              {hasOptions && (
                <div className="flex flex-col gap-1.5 mt-auto">
                  {availableOptions.map((option, i) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      onMouseEnter={() => audio.hover()}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={clsx(
                        "group flex items-baseline gap-3 text-left px-3 py-2 rounded-sm border bg-void-900/40 transition",
                        "hover:bg-blood-950/40",
                        TONE_BORDERS[option.tone ?? "neutral"],
                      )}
                    >
                      <span className="font-display text-[10px] text-ash-500 group-hover:text-gilt-400 tracking-widest min-w-[14px]">
                        {i + 1}
                      </span>
                      {option.checkLabel && (
                        <span className="text-[10px] text-force-400 uppercase tracking-widest font-display">
                          {option.checkLabel}
                        </span>
                      )}
                      <span className={clsx("text-sm leading-snug flex-1", TONE_COLORS[option.tone ?? "neutral"])}>
                        {applyTokens(option.text, tokens)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Auto-advance */}
              {isAutoAdvance && (
                <button
                  onClick={handleAutoAdvance}
                  className="mt-auto self-start text-[10px] text-ash-400 hover:text-gilt-400 uppercase tracking-[0.3em] transition group flex items-center gap-2"
                >
                  <span className="inline-block w-4 h-px bg-current group-hover:w-6 transition-all" />
                  Continue
                  <span className="animate-pulse">▸</span>
                </button>
              )}

              {!hasOptions && !isAutoAdvance && (
                <div className="mt-auto text-[10px] text-ash-500 italic uppercase tracking-widest">
                  [End of conversation]
                </div>
              )}
            </div>
          </div>

          {/* Decorative bottom accent */}
          <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-gilt-500/30 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Speaker silhouette ───────────────────────────────────────────────

type SpeakerKind = "sith_lord" | "imperial" | "acolyte" | "alien" | "narrator" | "generic";

function classifySpeaker(name: string): SpeakerKind {
  const n = name.toLowerCase();
  if (n.includes("darth")) return "sith_lord";
  if (n.includes("moff") || n.includes("commander") || n.includes("comandante") || n.includes("captain") || n.includes("capit")) return "imperial";
  if (n.includes("acolyte") || n.includes("acólit") || n.includes("acolit") || n.includes("apprentice") || n.includes("aprendiz") || n.includes("overseer") || n.includes("supervisor")) return "acolyte";
  if (n.includes("vex") || n.includes("grot") || n.includes("kira") || n.includes("twi'lek") || n.includes("rodian") || n.includes("rodiano")) return "alien";
  if (n === "narrator" || n === "narrador") return "narrator";
  return "generic";
}

function SpeakerSilhouette({
  kind,
  frame,
  imageUrl,
}: {
  kind: SpeakerKind;
  frame: number;
  imageUrl?: string | null;
}) {
  const breathe = Math.sin(frame * 0.025) * 0.5 + 0.5;
  const sway = Math.sin(frame * 0.018) * 1.2;

  if (imageUrl) {
    return (
      <div
        className="relative w-full flex items-end justify-center overflow-hidden"
        style={{
          height: 160,
          transform: `translateX(${sway * 0.3}px) translateY(${-breathe * 0.8}px)`,
          background: "rgba(5,5,10,0.95)",
        }}
      >
        {/* SVG filter: removes near-white background artifacts */}
        <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
          <defs>
            <filter id="dlg-portrait-clean" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                       -2.2 -2.2 -2.2 5 -0.1" />
            </filter>
          </defs>
        </svg>
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-auto object-contain object-bottom select-none"
          style={{ filter: "url(#dlg-portrait-clean) drop-shadow(0 0 12px rgba(100,15,35,0.6))" }}
        />
        {/* Stronger bottom fade hides foot shadow halos */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[rgba(5,5,10,0.95)] via-[rgba(5,5,10,0.5)] to-transparent pointer-events-none" />
      </div>
    );
  }

  if (kind === "narrator") {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 140 }}>
        <div className="font-display text-3xl text-ash-600 italic">…</div>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 100 160" overflow="visible" style={{ width: "auto", height: 160 }} aria-hidden="true">
      <defs>
        <filter id="dlg-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>
      <g transform={`translate(${sway * 0.4}, ${-breathe * 1.2})`}>
        {/* Ground shadow */}
        <ellipse cx="50" cy="158" rx="32" ry="4" fill="rgba(0,0,0,0.45)" />
        {kind === "sith_lord" && <SithLordBody />}
        {kind === "imperial" && <ImperialBody />}
        {kind === "acolyte" && <AcolyteBody />}
        {kind === "alien" && <AlienBody />}
        {kind === "generic" && <GenericBody />}
      </g>
    </svg>
  );
}

function SithLordBody() {
  return (
    <g>
      {/* Long cloak silhouette */}
      <path d="M22,52 L12,156 L88,156 L78,52 Z" fill="#06061a" stroke="#16162a" strokeWidth="0.4" />
      <path d="M28,52 L20,154 L80,154 L72,52 Z" fill="#0a0a18" />
      {/* Shoulders */}
      <path d="M20,46 L8,52 L14,68 L30,60" fill="#0c0c1e" />
      <path d="M80,46 L92,52 L86,68 L70,60" fill="#0c0c1e" />
      {/* Torso plate */}
      <path d="M30,46 L70,46 L66,86 L34,86 Z" fill="#0c0c1e" stroke="#16162a" strokeWidth="0.4" />
      <line x1="50" y1="50" x2="50" y2="84" stroke="#1a1a30" strokeWidth="0.6" />
      {/* Neck */}
      <rect x="42" y="36" width="16" height="8" rx="2" fill="#0a0a14" />
      {/* Hood / helmet */}
      <path d="M30,10 L50,2 L70,10 L74,40 L26,40 Z" fill="#08081a" />
      <path d="M34,14 L50,8 L66,14 L68,36 L32,36 Z" fill="#04040e" />
      <ellipse cx="50" cy="24" rx="12" ry="14" fill="#020208" />
      {/* Eye glow */}
      <rect x="38" y="22" width="24" height="3" rx="1.5" fill="#ff3355" opacity="0.8" />
      <rect x="38" y="22" width="24" height="3" rx="1.5" fill="rgba(220,30,60,0.4)" filter="url(#dlg-glow)" />
    </g>
  );
}

function ImperialBody() {
  return (
    <g>
      {/* Long greatcoat */}
      <path d="M28,50 L20,156 L80,156 L72,50 Z" fill="#0c0c1a" stroke="#1a1a2a" strokeWidth="0.4" />
      {/* Belt */}
      <rect x="26" y="92" width="48" height="5" rx="1" fill="#1a1a2a" />
      <rect x="46" y="93" width="8" height="3" rx="1" fill="#3a3a55" />
      {/* Shoulders / pauldron */}
      <path d="M26,48 L14,52 L18,66 L34,60" fill="#0e0e1c" />
      <path d="M74,48 L86,52 L82,66 L66,60" fill="#0e0e1c" />
      {/* Torso */}
      <path d="M30,46 L70,46 L68,90 L32,90 Z" fill="#0e0e1c" />
      <line x1="50" y1="46" x2="50" y2="90" stroke="#1a1a2a" strokeWidth="0.5" />
      {/* Rank insignia */}
      <rect x="34" y="60" width="6" height="2" fill="#5a4a2a" />
      <rect x="34" y="64" width="6" height="2" fill="#5a4a2a" />
      <rect x="34" y="68" width="6" height="2" fill="#7a5a2a" />
      {/* Neck */}
      <rect x="42" y="34" width="16" height="12" rx="2" fill="#0e0e1c" />
      {/* Head — uncovered, severe face */}
      <ellipse cx="50" cy="22" rx="12" ry="14" fill="#3a2a26" />
      {/* Cap */}
      <path d="M36,8 L64,8 L66,18 L34,18 Z" fill="#08081a" />
      <rect x="36" y="16" width="28" height="3" fill="#06060f" />
      {/* Eyes */}
      <rect x="42" y="22" width="3" height="2" rx="1" fill="#0a0a14" />
      <rect x="55" y="22" width="3" height="2" rx="1" fill="#0a0a14" />
      {/* Mouth — thin line */}
      <line x1="44" y1="32" x2="56" y2="32" stroke="#1a0e0c" strokeWidth="1" />
    </g>
  );
}

function AcolyteBody() {
  return (
    <g>
      {/* Simple robes */}
      <path d="M26,52 L18,156 L82,156 L74,52 Z" fill="#10101e" stroke="#1a1a2a" strokeWidth="0.4" />
      <path d="M32,56 L28,150 L72,150 L68,56 Z" fill="#14141e" />
      {/* Shoulders */}
      <path d="M28,48 L18,54 L24,66 L36,58" fill="#0e0e1a" />
      <path d="M72,48 L82,54 L76,66 L64,58" fill="#0e0e1a" />
      {/* Torso */}
      <path d="M32,46 L68,46 L66,90 L34,90 Z" fill="#14141e" />
      {/* Belt */}
      <rect x="30" y="86" width="40" height="4" rx="1" fill="#1c1c26" />
      {/* Neck */}
      <rect x="44" y="36" width="12" height="8" rx="2" fill="#10101e" />
      {/* Head — visible face */}
      <ellipse cx="50" cy="24" rx="11" ry="13" fill="#2a1e1a" />
      {/* Hood pushed back */}
      <path d="M36,10 L50,4 L64,10 L66,22 L34,22 Z" fill="#0a0a18" />
      {/* Hair */}
      <path d="M40,14 L60,14 L62,22 L38,22 Z" fill="#1a0e08" />
      {/* Eyes */}
      <ellipse cx="44" cy="26" rx="2" ry="1.2" fill="#0a0a14" />
      <ellipse cx="56" cy="26" rx="2" ry="1.2" fill="#0a0a14" />
      {/* Faint corrupted glow */}
      <ellipse cx="44" cy="26" rx="2.5" ry="1.5" fill="#cc4444" opacity="0.35" filter="url(#dlg-glow)" />
      <ellipse cx="56" cy="26" rx="2.5" ry="1.5" fill="#cc4444" opacity="0.35" filter="url(#dlg-glow)" />
      {/* Mouth */}
      <line x1="46" y1="34" x2="54" y2="34" stroke="#1a0e0c" strokeWidth="0.8" />
    </g>
  );
}

function AlienBody() {
  return (
    <g>
      {/* Slimmer, hunched body */}
      <path d="M30,54 L24,156 L76,156 L70,54 Z" fill="#0e1018" stroke="#1a1c26" strokeWidth="0.4" />
      {/* Patchwork clothing */}
      <path d="M34,58 L32,150 L68,150 L66,58 Z" fill="#161826" />
      <rect x="38" y="80" width="24" height="6" fill="#1a2030" />
      <rect x="34" y="100" width="32" height="3" fill="#1a2030" />
      {/* Shoulders — narrower */}
      <path d="M32,52 L24,58 L28,68 L38,62" fill="#0e1018" />
      <path d="M68,52 L76,58 L72,68 L62,62" fill="#0e1018" />
      {/* Torso */}
      <path d="M34,48 L66,48 L64,90 L36,90 Z" fill="#14181e" />
      {/* Neck */}
      <rect x="44" y="38" width="12" height="8" rx="2" fill="#10141a" />
      {/* Head — elongated */}
      <ellipse cx="50" cy="24" rx="13" ry="15" fill="#2e3a2a" />
      {/* Lekku (Twi'lek-style tendrils) OR antennae */}
      <path d="M40,32 Q34,42 36,52" fill="none" stroke="#2e3a2a" strokeWidth="4" strokeLinecap="round" />
      <path d="M60,32 Q66,42 64,52" fill="none" stroke="#2e3a2a" strokeWidth="4" strokeLinecap="round" />
      {/* Large eyes */}
      <ellipse cx="44" cy="22" rx="3" ry="2.5" fill="#fff0a0" opacity="0.85" />
      <ellipse cx="56" cy="22" rx="3" ry="2.5" fill="#fff0a0" opacity="0.85" />
      <ellipse cx="44" cy="22" rx="1.2" ry="2.2" fill="#0a0a14" />
      <ellipse cx="56" cy="22" rx="1.2" ry="2.2" fill="#0a0a14" />
      {/* Mouth */}
      <ellipse cx="50" cy="32" rx="4" ry="1" fill="#0a0a14" />
    </g>
  );
}

function GenericBody() {
  return (
    <g>
      {/* Cloaked figure — neutral */}
      <path d="M26,52 L18,156 L82,156 L74,52 Z" fill="#0a0a14" stroke="#16162a" strokeWidth="0.4" />
      <path d="M30,56 L24,150 L76,150 L70,56 Z" fill="#0e0e1a" />
      <path d="M28,48 L18,54 L22,66 L34,60" fill="#0c0c18" />
      <path d="M72,48 L82,54 L78,66 L66,60" fill="#0c0c18" />
      <path d="M32,46 L68,46 L66,90 L34,90 Z" fill="#0e0e1a" />
      <rect x="44" y="36" width="12" height="8" rx="2" fill="#0a0a14" />
      <path d="M36,10 L50,4 L64,10 L66,30 L34,30 Z" fill="#08081a" />
      <ellipse cx="50" cy="22" rx="11" ry="12" fill="#04040e" />
      <rect x="42" y="22" width="16" height="2" rx="1" fill="#3a3a55" opacity="0.6" />
    </g>
  );
}
