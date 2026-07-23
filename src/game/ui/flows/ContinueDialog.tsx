"use client";

import { useEffect, useState } from "react";
import { listSaves, loadSave, deleteSave } from "@/game/engine/save/dexie-schema";
import type { SaveSlotMeta } from "@/game/engine/save/types";
import { useGameStore } from "@/game/store/game-store";
import { useI18n } from "@/i18n";

export function ContinueDialog({
  onClose,
  onNoSaves,
}: {
  onClose: () => void;
  onNoSaves: () => void;
}) {
  const [saves, setSaves] = useState<SaveSlotMeta[] | null>(null);
  /** Save id pending delete confirmation (two-step to avoid misclicks). */
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const hydrate = useGameStore((s) => s.hydrateFromSave);
  const t = useI18n((s) => s.t);

  useEffect(() => {
    listSaves().then((s) => {
      if (s.length === 0) {
        onNoSaves();
        return;
      }
      setSaves(s);
    });
  }, [onNoSaves]);

  async function handleDelete(id: string) {
    await deleteSave(id);
    const remaining = await listSaves();
    setConfirmingId(null);
    if (remaining.length === 0) {
      onNoSaves();
      return;
    }
    setSaves(remaining);
  }

  if (!saves) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-void-950/90 backdrop-blur flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="panel p-6 w-full max-w-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-5 flex-none">
          <h2 className="heading-display text-lg">{t.load.title}</h2>
          <button onClick={onClose} className="btn-ghost !py-1 !px-3 text-xs">
            {t.load.close}
          </button>
        </header>
        <ul className="space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {saves.map((s) => (
            <li key={s.id} className="flex items-stretch gap-2">
              <button
                onClick={async () => {
                  const full = await loadSave(s.id);
                  if (!full) return;
                  hydrate(full);
                  onClose();
                }}
                className="flex-1 text-left panel px-4 py-3 hover:border-gilt-500/40 transition flex items-center justify-between gap-4 min-w-0"
              >
                <div className="min-w-0">
                  <div className="font-display text-ash-100 truncate">{s.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-ash-300 truncate">
                    {s.classId} · {s.zoneId.replaceAll("_", " ")}
                    {s.ironman ? ` · ${t.load.ironman}` : ""}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ash-400 whitespace-nowrap">
                  {new Date(s.updatedAt).toLocaleString()}
                </div>
              </button>
              {confirmingId === s.id ? (
                <div className="flex flex-col gap-1 justify-center flex-none">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-blood-500/70 text-blood-300 hover:bg-blood-900/40 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-ash-600/40 text-ash-400 hover:text-ash-200 transition"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(s.id)}
                  title="Delete this save"
                  aria-label="Delete this save"
                  className="flex-none px-3 rounded-sm border border-ash-700/30 text-ash-500 hover:text-blood-400 hover:border-blood-600/50 transition text-sm"
                >
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
