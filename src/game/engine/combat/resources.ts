/**
 * Combat resource type definitions.
 *
 * Rage (Marauder) and Stealth (Assassin) are secondary resources that
 * power class-specific mechanics beyond the base Force/HP economy.
 *
 * Source: Advanced Implementation Proposals §2 "Class Resource Systems".
 */

// ═══════════════════════════════════════════════════════════════════════
// Rage (Marauder)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Rage builds when the Marauder takes damage or deals consecutive hits.
 * Decays by 5 per turn when not in combat.
 */
export interface RageResource {
  current: number;
  max: number;
  /** Rage gained per hit taken. */
  gainOnHit: number;
  /** Rage gained per hit dealt. */
  gainOnAttack: number;
  /** Rage gained per kill. */
  gainOnKill: number;
  /** Rage lost per idle turn (no action taken). */
  decayPerIdleTurn: number;
}

/** Rage thresholds that unlock passive bonuses. */
export const RAGE_THRESHOLDS = {
  /** 25 Rage → +10% damage, unlock Blood Rage empowered mode. */
  LOW: 25,
  /** 50 Rage → +20% damage, +10% crit chance. */
  MEDIUM: 50,
  /** 75 Rage → +35% damage, immunity to fear/stun. */
  HIGH: 75,
  /** 100 Rage → Berserk: +50% damage, halved armor, can't be stopped. */
  MAX: 100,
} as const;

export type RageThreshold = typeof RAGE_THRESHOLDS[keyof typeof RAGE_THRESHOLDS];

/** Default Rage resource values for a new Marauder. */
export const DEFAULT_RAGE: RageResource = {
  current: 0,
  max: 100,
  gainOnHit: 8,
  gainOnAttack: 4,
  gainOnKill: 20,
  decayPerIdleTurn: 5,
};

// ═══════════════════════════════════════════════════════════════════════
// Stealth (Assassin)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Stealth represents the Assassin's detection level.
 * 0 = fully hidden. 100 = fully detected.
 * Entering combat resets to 100. Vanish drops it to 0.
 */
export interface StealthResource {
  /** 0 (hidden) → 100 (fully detected). */
  detectionLevel: number;
  /** Whether the assassin is currently in stealth mode. */
  inStealth: boolean;
  /** Detection increase per turn in hostile zone. */
  detectionGainPerTurn: number;
  /** Detection increase on attacking from stealth. */
  detectionGainOnAttack: number;
  /** Detection cleared when successfully using Vanish/Force Cloak. */
  detectionOnVanish: number;
}

/** Stealth detection thresholds. */
export const STEALTH_THRESHOLDS = {
  /** 0-25: Unseen — enemies cannot target you, backstab bonus applies. */
  UNSEEN: 25,
  /** 26-60: Suspicious — enemies may randomly detect you. */
  SUSPICIOUS: 60,
  /** 61-99: Compromised — enemies will act on next turn. */
  COMPROMISED: 99,
  /** 100: Detected — stealth broken, combat normal. */
  DETECTED: 100,
} as const;

/** Default Stealth resource values for a new Assassin. */
export const DEFAULT_STEALTH: StealthResource = {
  detectionLevel: 100,
  inStealth: false,
  detectionGainPerTurn: 15,
  detectionGainOnAttack: 40,
  detectionOnVanish: 0,
};

// ═══════════════════════════════════════════════════════════════════════
// Resource State Helpers
// ═══════════════════════════════════════════════════════════════════════

export function getRageThresholdLabel(rage: number): string {
  if (rage >= RAGE_THRESHOLDS.MAX) return "berserk";
  if (rage >= RAGE_THRESHOLDS.HIGH) return "high";
  if (rage >= RAGE_THRESHOLDS.MEDIUM) return "medium";
  if (rage >= RAGE_THRESHOLDS.LOW) return "low";
  return "none";
}

export function getRageDamageMultiplier(rage: number): number {
  if (rage >= RAGE_THRESHOLDS.MAX) return 1.5;
  if (rage >= RAGE_THRESHOLDS.HIGH) return 1.35;
  if (rage >= RAGE_THRESHOLDS.MEDIUM) return 1.2;
  if (rage >= RAGE_THRESHOLDS.LOW) return 1.1;
  return 1.0;
}

export function isStealthActive(stealth: StealthResource): boolean {
  return stealth.inStealth && stealth.detectionLevel < STEALTH_THRESHOLDS.SUSPICIOUS;
}

export function canBackstab(stealth: StealthResource): boolean {
  return stealth.inStealth && stealth.detectionLevel <= STEALTH_THRESHOLDS.UNSEEN;
}
