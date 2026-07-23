"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/game/store/game-store";
import { DynamicScene, getScenePalette } from "@/game/scenes/DynamicScene";
import { AtmosphereCanvas } from "@/game/scenes/effects/AtmosphereCanvas";
import { PlayerCharacter } from "@/game/scenes/PlayerCharacter";
import { SceneEntities } from "@/game/scenes/SceneEntities";
import { ZONE_MAP } from "@/game/data/zones/all-zones";
import { useAccessibilityStore } from "@/game/store/accessibility-store";
import { ZoneView } from "@/game/ui/world/ZoneView";
import { HUD } from "@/game/ui/hud/HUD";
import { PanelLayer } from "@/game/ui/hud/PanelLayer";
import { ToastLayer } from "@/game/ui/hud/ToastLayer";
import { LevelUpCelebration } from "@/game/ui/hud/LevelUpCelebration";
import { GlobalHotkeys } from "@/game/ui/hud/GlobalHotkeys";
import { CharacterCreation } from "@/game/ui/flows/CharacterCreation";
import { ContinueDialog } from "@/game/ui/flows/ContinueDialog";
import { CombatUI } from "@/game/ui/combat/CombatUI";
import { DialogueUI } from "@/game/ui/dialogue/DialogueUI";
import { useDialogueConsequences } from "@/game/ui/dialogue/useDialogueConsequences";
import { useDialogueStore } from "@/game/engine/dialogue/dialogue-store";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { useI18n } from "@/i18n";

type Mode = "boot" | "creating" | "continuing" | "playing";

export default function PlayPage() {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <PlayPageInner />
    </Suspense>
  );
}

function PlayPageInner() {
  const params = useSearchParams();
  const character = useGameStore((s) => s.character);
  const world = useGameStore((s) => s.world);
  const showToast = useGameStore((s) => s.showToast);
  const saveCurrent = useGameStore((s) => s.saveCurrent);
  const combatPhase = useCombatStore((s) => s.phase);
  const dialogueActive = useDialogueStore((s) => s.active);
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);
  const t = useI18n((s) => s.t);
  const [mode, setMode] = useState<Mode>("boot");

  // Tint the atmospheric effects layer with the active zone's palette.
  const sceneId = world?.zoneId ? ZONE_MAP.get(world.zoneId)?.sceneId : undefined;
  const sceneAccent = getScenePalette(sceneId).accent;

  // Apply dialogue consequences (flags, quests, XP, combat triggers) to game state
  useDialogueConsequences();

  // Initial routing
  useEffect(() => {
    if (character) {
      setMode("playing");
      return;
    }
    if (params.get("continue") === "1") setMode("continuing");
    else setMode("creating");
  }, [character, params]);

  // Autosave every 60s when playing
  useEffect(() => {
    if (mode !== "playing") return;
    const interval = setInterval(() => {
      void saveCurrent().then(() => showToast(t.play.autosaved, "info"));
    }, 60_000);
    return () => clearInterval(interval);
  }, [mode, saveCurrent, showToast, t]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-void-950">
      {/* World — 2D illustrated scene with zone hotspots */}
      {mode === "playing" && (
        <>
          <DynamicScene />
          <AtmosphereCanvas accent={sceneAccent} reducedMotion={reducedMotion} />
          <SceneEntities />
          <PlayerCharacter />
          <ZoneView />
          <div className="atmo-grain" aria-hidden />
        </>
      )}

      {/* HUD layers */}
      {mode === "playing" && character && (
        <>
          <HUD />
          <PanelLayer />
          <ToastLayer />
          <LevelUpCelebration />
          <GlobalHotkeys />
          {combatPhase !== "idle" && <CombatUI />}
          {dialogueActive && character && world && (
            <DialogueUI
              ctx={{
                playerLevel: character.level,
                playerClassId: character.classId,
                primary: character.primary,
                factionRep: world.factionRep,
                questFlags: world.questFlags,
                inventory: character.inventory.map((i) => ({
                  itemId: i.itemId,
                  qty: i.qty,
                })),
              }}
            />
          )}
        </>
      )}

      {/* Onboarding flows */}
      {mode === "creating" && (
        <CharacterCreation onCancel={() => history.back()} />
      )}
      {mode === "continuing" && (
        <ContinueDialog
          onClose={() => setMode("playing")}
          onNoSaves={() => setMode("creating")}
        />
      )}

      {mode === "boot" && <CanvasFallback />}
    </main>
  );
}

function CanvasFallback() {
  const t = useI18n((s) => s.t);
  return (
    <div className="absolute inset-0 flex items-center justify-center text-ash-400">
      <div className="heading-display animate-flicker">{t.play.awakening}</div>
    </div>
  );
}
