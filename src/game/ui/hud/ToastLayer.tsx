"use client";

import { useGameStore } from "@/game/store/game-store";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ToastLayer() {
  const toast = useGameStore((s) => s.ui.toast);
  const [shown, setShown] = useState(toast);

  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    const t = setTimeout(() => setShown(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed top-6 left-1/2 -translate-x-1/2 z-40">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="panel px-4 py-2 text-sm text-ash-100"
          >
            {shown.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
