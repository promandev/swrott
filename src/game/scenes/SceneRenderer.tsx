"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/**
 * 2D Scene Renderer.
 *
 * Renders layered illustrated backgrounds with:
 *  - Parallax on mouse movement (subtle, cinematic)
 *  - Smooth cross-fade transitions between scenes
 *  - Slot for foreground overlays (particles, light rays, fog)
 *
 * Each "scene" is a stack of positioned <div> layers painted with
 * CSS gradients, SVG silhouettes, or background-image from AI art.
 *
 * When AI-generated matte paintings are available, set them as
 * background-image on layers for stunning quality.
 */

interface SceneRendererProps {
  children: ReactNode;
  /** Enable subtle parallax on mouse movement. */
  parallax?: boolean;
  /** Parallax intensity (1 = subtle, 3 = dramatic). */
  parallaxIntensity?: number;
  className?: string;
}

export function SceneRenderer({
  children,
  parallax = true,
  parallaxIntensity = 1.2,
  className = "",
}: SceneRendererProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: ((e.clientX - cx) / cx) * parallaxIntensity * 8,
        y: ((e.clientY - cy) / cy) * parallaxIntensity * 4,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallax, parallaxIntensity]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        ["--px" as string]: `${offset.x}px`,
        ["--py" as string]: `${offset.y}px`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A single parallax layer. Depth controls how much it moves:
 *  0 = static background, 1 = moves with mouse (foreground).
 */
export function SceneLayer({
  children,
  depth = 0,
  className = "",
  style,
}: {
  children?: ReactNode;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute inset-0 transition-transform duration-700 ease-out ${className}`}
      style={{
        transform: `translate(calc(var(--px, 0px) * ${depth}), calc(var(--py, 0px) * ${depth}))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Transition wrapper — cross-fades between scenes.
 */
export function SceneTransition({
  sceneKey,
  children,
}: {
  sceneKey: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={sceneKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.6, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}
