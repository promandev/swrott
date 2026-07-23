"use client";

import { useGameStore } from "@/game/store/game-store";
import { computeMaxForce, computeMaxHP } from "@/game/engine/progression/stats";
import { summarizeGear } from "@/game/engine/items/equipment";
import { computeTalentModifiers } from "@/game/engine/progression/talent-effects";
import { useAudio } from "@/game/audio/use-audio";
import { clsx } from "clsx";
import { useI18n } from "@/i18n";
import { getClassImage } from "@/game/utils/character-images";
import { ZONE_MAP, PLANET_MAP } from "@/game/data/zones/all-zones";
import { getWeatherForZone, WEATHER_EFFECTS } from "@/game/engine/combat/weather";
import { huntedLevel } from "@/game/engine/factions/reputation";
import { getSithRank } from "@/game/engine/progression/rank";
import { COMPANIONS } from "@/game/engine/companions/companions";
import { QUEST_BY_ID } from "@/game/data/quests/quest-registry";

export function HUD() {
  const character = useGameStore((s) => s.character);
  const meta = useGameStore((s) => s.meta);
  const zoneId = useGameStore((s) => s.world?.zoneId);
  const factionRep = useGameStore((s) => s.world?.factionRep);
  const openPanel = useGameStore((s) => s.openPanel);
  const meditate = useGameStore((s) => s.meditate);
  const restedZoneId = useGameStore((s) => s.ui.restedZoneId);
  const t = useI18n((s) => s.t);

  if (!character || !meta) return null;

  const zone = zoneId ? ZONE_MAP.get(zoneId) : undefined;
  const planet = zone ? PLANET_MAP.get(zone.planetId) : undefined;
  const weather = zoneId ? getWeatherForZone(zoneId) : "clear";
  const hunted = factionRep ? huntedLevel(factionRep) : 0;

  // True max includes gear + talent bonuses, matching the combat engine and the
  // post-combat HP persisted by setVitals (otherwise the bar mis-reports max).
  const gear = summarizeGear(character);
  const tmods = computeTalentModifiers(character);
  const maxHp = computeMaxHP(character.primary.endurance + gear.stats.endurance + tmods.endurance, character.level) + gear.hpBonus + tmods.maxHp;
  const maxFp = computeMaxForce(character.primary.force + gear.stats.force + tmods.force, character.level) + gear.fpBonus + tmods.maxFp;
  const hpPct = Math.max(0, Math.min(1, character.hp / maxHp));
  const fpPct = Math.max(0, Math.min(1, character.forcePoints / maxFp));

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col">
      {/* Top bar */}
      <header className="pointer-events-auto flex items-start justify-between p-3 sm:p-5">
        {/* Vitals cluster — portrait + condensed bars in a single frameless group */}
        <div className="flex items-center gap-3">
          <PortraitFrame
            name={character.name}
            rankTitle={getSithRank(character.classId, character.level, character.primary.corruption).title}
            level={character.level}
          />
          <div className="flex flex-col gap-2 min-w-[190px] pt-0.5">
            <Bar label={t.hud.hp} value={character.hp} max={maxHp} pct={hpPct} tone="blood" />
            <Bar label={t.hud.force} value={character.forcePoints} max={maxFp} pct={fpPct} tone="force" />
            <MeditateButton
              onMeditate={meditate}
              rested={restedZoneId === zoneId}
              full={character.hp >= maxHp && character.forcePoints >= maxFp}
            />
            <PartyStrip />
          </div>
        </div>

        {/* Location — frameless, right-aligned, separated by a thin gilt rule */}
        <div className="hidden sm:flex items-center gap-3 pr-1">
          <div className="flex flex-col items-end">
            <span className="font-display text-sm tracking-[0.25em] uppercase text-gilt-500 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {planet?.name ?? t.hud.korriban}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-ash-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {zone?.name ?? t.hud.academyExterior}
            </span>
            {weather !== "clear" && (
              <span
                title={WEATHER_EFFECTS[weather].description}
                className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-force-300/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              >
                ☁ {WEATHER_EFFECTS[weather].label}
              </span>
            )}
            {hunted > 0 && (
              <span
                title="Factions you've angered are hunting you — ambushes are more frequent. Improve your standing to ease the pressure."
                className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-blood-400 animate-pulse drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              >
                ⚠ Hunted{hunted >= 3 ? " ··" : ""}
              </span>
            )}
            <QuestTracker onOpen={() => openPanel("journal")} />
          </div>
          <span className="h-8 w-px bg-gradient-to-b from-transparent via-gilt-600/50 to-transparent" />
        </div>
      </header>

      <div className="flex-1" />

      {/* Bottom bar — icon shortcuts. Combat has its own ability bar, so the
          exploration HUD stays slim and never covers zone hotspots. */}
      <footer className="pointer-events-none p-3 sm:p-4 flex flex-col items-center">
        <div className="pointer-events-auto">
          <NavBar onOpen={openPanel} t={t} />
        </div>
      </footer>
    </div>
  );
}

function PortraitFrame({
  name,
  rankTitle,
  level,
}: {
  name: string;
  rankTitle: string;
  level: number;
}) {
  const character = useGameStore((s) => s.character);
  const imgSrc = getClassImage(character?.classId ?? "marauder");
  return (
    <div className="flex items-center gap-3">
      <div className="hud-portrait relative w-14 h-14">
        <div className="absolute inset-0 rounded-sm border border-gilt-700/50 bg-void-950 overflow-hidden shadow-[0_0_18px_rgba(196,30,58,0.3)]">
          <img
            src={imgSrc}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-950/70 via-transparent to-transparent" />
        </div>
        {/* Gilt corner ticks */}
        <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-gilt-500/80" />
        <span className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-gilt-500/80" />
        <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-gilt-500/80" />
        <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-gilt-500/80" />
        {/* Level badge */}
        <span className="absolute -bottom-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center text-[10px] font-display font-semibold text-ash-100 bg-blood-grad border border-gilt-600/60 rounded-sm shadow-[0_0_8px_rgba(196,30,58,0.5)]">
          {level}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-sm text-ash-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          {name}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-gilt-400/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {rankTitle}
        </span>
      </div>
    </div>
  );
}

/** Current-objective tracker — surfaces the top active quest's next step so
 *  the main story's progression is always visible during exploration. */
function QuestTracker({ onOpen }: { onOpen: () => void }) {
  const activeQuests = useGameStore((s) => s.world?.activeQuests);
  const questFlags = useGameStore((s) => s.world?.questFlags);
  if (!activeQuests || activeQuests.length === 0 || !questFlags) return null;

  // Prefer a main-arc quest; fall back to the first active one.
  const quests = activeQuests.map((id) => QUEST_BY_ID.get(id)).filter(Boolean);
  const quest = quests.find((q) => q!.category === "main") ?? quests[0];
  if (!quest) return null;

  const nextObjective = quest.objectives.find((o) => !o.optional && !questFlags[o.flagKey]);
  const required = quest.objectives.filter((o) => !o.optional);
  const done = required.filter((o) => questFlags[o.flagKey]).length;

  return (
    <button
      onClick={onOpen}
      title="Open the quest journal"
      className="mt-1.5 max-w-[230px] text-right rounded-sm border border-gilt-700/30 bg-void-950/70 px-2 py-1 backdrop-blur-sm hover:border-gilt-600/50 transition pointer-events-auto"
    >
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[9px] uppercase tracking-[0.25em] text-gilt-500">
          {quest.category === "main" ? "★ Main" : "Quest"}
        </span>
        <span className="text-[10px] text-ash-300 truncate">{quest.name}</span>
        {required.length > 0 && (
          <span className="text-[8px] tabular-nums text-ash-500">{done}/{required.length}</span>
        )}
      </div>
      {nextObjective && (
        <div className="text-[10px] text-gilt-300 leading-tight truncate">
          ▸ {nextObjective.description}
        </div>
      )}
    </button>
  );
}

/** Compact active-party indicator under the vitals — shows who fights with you. */
function PartyStrip() {
  const companions = useGameStore((s) => s.world?.companions);
  const inParty = (companions ?? []).filter((c) => c.inParty);
  if (inParty.length === 0) return null;
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <span className="text-[8px] uppercase tracking-[0.2em] text-ash-500 mr-0.5">Party</span>
      {inParty.map((c) => {
        const def = COMPANIONS.find((d) => d.id === c.id);
        const initials = (def?.name ?? c.id).split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        return (
          <span
            key={c.id}
            title={`${def?.name ?? c.id} — ${def?.title ?? "Companion"}`}
            className="flex items-center justify-center w-5 h-5 rounded-sm border border-force-700/50 bg-force-950/50 text-[8px] font-display text-force-300"
          >
            {initials}
          </span>
        );
      })}
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  pct,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  pct: number;
  tone: "blood" | "force";
}) {
  const low = tone === "blood" && pct <= 0.3;
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-ash-300 mb-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        <span>{label}</span>
        <span className={clsx("tabular-nums", low && "text-blood-400")}>
          {value} / {max}
        </span>
      </div>
      <div className="hud-bar relative h-2.5 rounded-[2px] overflow-hidden">
        <div
          className={clsx(
            "hud-bar-fill h-full",
            tone === "blood" && "bg-gradient-to-r from-blood-700 via-blood-500 to-blood-400",
            tone === "force" && "bg-gradient-to-r from-force-700 via-force-600 to-force-500",
            low && "animate-pulse",
          )}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}

function MeditateButton({
  onMeditate,
  rested,
  full,
}: {
  onMeditate: () => void;
  rested: boolean;
  full: boolean;
}) {
  const audio = useAudio();
  const disabled = rested || full;
  const label = full ? "Restored" : rested ? "Rested here" : "Meditate";
  return (
    <button
      onClick={() => { if (!disabled) { audio.click(); onMeditate(); } }}
      disabled={disabled}
      title={
        full
          ? "Body and spirit are already whole."
          : rested
            ? "You have already meditated in this zone. Travel onward to rest again."
            : "Meditate — restore some HP and most Force. Once per zone."
      }
      className={clsx(
        "mt-0.5 inline-flex items-center justify-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.2em] font-display transition drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
        disabled
          ? "border-ash-700/30 text-ash-600 cursor-default"
          : "border-force-700/50 text-force-300 hover:bg-force-900/25 hover:text-force-200",
      )}
    >
      <span aria-hidden>☯</span>
      {label}
    </button>
  );
}

type PanelId = "character" | "inventory" | "journal" | "map" | "menu";

const NAV_ICONS: Record<PanelId, JSX.Element> = {
  character: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16v13H4z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      <path d="M4 11h16" />
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 9h7M8 13h7M8 17h4" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  ),
};

function NavBar({
  onOpen,
  t,
}: {
  onOpen: (p: PanelId) => void;
  t: ReturnType<typeof useI18n.getState>["t"];
}) {
  const audio = useAudio();
  const items: Array<{ id: PanelId; label: string; hotkey: string }> = [
    { id: "character", label: t.hud.character, hotkey: "C" },
    { id: "inventory", label: t.hud.inventory, hotkey: "I" },
    { id: "journal", label: t.hud.journal, hotkey: "J" },
    { id: "map", label: t.hud.map, hotkey: "M" },
    { id: "menu", label: t.hud.menu, hotkey: "Esc" },
  ];
  return (
    <nav className="hud-nav flex items-center gap-1.5 px-2 py-1.5 rounded-md">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => { audio.openPanel(); onOpen(it.id); }}
          onMouseEnter={() => audio.hover()}
          aria-label={it.label}
          title={`${it.label} · ${it.hotkey}`}
          className="hud-nav-btn group relative flex items-center justify-center w-10 h-10 rounded-sm text-ash-300 hover:text-gilt-400 transition-colors duration-150"
        >
          <span className="w-5 h-5">{NAV_ICONS[it.id]}</span>
          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-gilt-700/30 bg-void-900/95 px-2 py-1 text-[10px] uppercase tracking-widest text-ash-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {it.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
