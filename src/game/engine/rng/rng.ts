import seedrandom from "seedrandom";

/**
 * Deterministic RNG. Used for combat, loot, and procedural content.
 * A given seed always produces the same sequence — critical for replay,
 * debugging, and tests.
 */
export class RNG {
  private rng: seedrandom.PRNG;

  constructor(public readonly seed: string) {
    this.rng = seedrandom(seed);
  }

  /** Float in [0, 1). */
  next(): number {
    return this.rng();
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Float in [min, max). */
  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Pick a random element. Returns undefined if empty. */
  pick<T>(arr: readonly T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[this.int(0, arr.length - 1)];
  }

  /** Weighted pick. weights[i] corresponds to items[i]. */
  weighted<T>(items: readonly T[], weights: readonly number[]): T | undefined {
    if (items.length === 0 || items.length !== weights.length) return undefined;
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return undefined;
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i]!;
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}
