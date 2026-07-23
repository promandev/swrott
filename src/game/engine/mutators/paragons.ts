/**
 * Mutator paragon synergies (Complementary Loop 4 / Idea CL4-C).
 *
 * Combining specific mutators unlocks a Paragon Synergy — a unique bonus
 * effect on top of the individual mutator bonuses. Encourages experimentation
 * with combos.
 */

export interface MutatorParagon {
  id: string;
  name: string;
  description: string;
  requiredMutatorIds: string[];
  effectId: string;
}

export const MUTATOR_PARAGONS: MutatorParagon[] = [
  { id: "paragon_glass_blade",      name: "La Hoja de Cristal",
    description: "Cañón de Cristal + Hoja Pura: los críticos curan el 5% de los PV máximos.",
    requiredMutatorIds: ["glass_cannon", "pure_blade"],
    effectId: "paragon_glass_blade" },
  { id: "paragon_eternal_hunger",   name: "Hambre Eterna",
    description: "Cazador de Ecos + Augurio Oscuro: cada acumulación de eco otorga +1 ficha oscura.",
    requiredMutatorIds: ["echo_hunter", "dark_omen"],
    effectId: "paragon_eternal_hunger" },
  { id: "paragon_unbreakable",      name: "Inquebrantable",
    description: "Voluntad de Hierro + Sin Piedad: +30% de PV máximos.",
    requiredMutatorIds: ["iron_will", "no_mercy"],
    effectId: "paragon_unbreakable" },
  { id: "paragon_storm_kissed",     name: "Besado por la Tormenta",
    description: "Invierno Eterno + Fuerza Pura: el daño de descarga se encadena a +1 objetivo.",
    requiredMutatorIds: ["eternal_winter", "pure_force"],
    effectId: "paragon_storm_kissed" },
  { id: "paragon_chaos_lord",       name: "Señor del Caos",
    description: "Botín Caótico + Cañón de Cristal: el botín siempre incluye +1 afijo.",
    requiredMutatorIds: ["chaos_loot", "glass_cannon"],
    effectId: "paragon_chaos_lord" },
  { id: "paragon_one_chance",       name: "Una Oportunidad",
    description: "Muerte Permanente + Sin Piedad: +100% de XP por jefes abatidos.",
    requiredMutatorIds: ["permadeath", "no_mercy"],
    effectId: "paragon_one_chance" },
  { id: "paragon_apex",             name: "Sith Supremo",
    description: "Voluntad de Hierro + Hoja Pura + Sin Piedad: los cambios de postura son gratis.",
    requiredMutatorIds: ["iron_will", "pure_blade", "no_mercy"],
    effectId: "paragon_apex" },
];

export function activeParagons(activeMutatorIds: readonly string[]): MutatorParagon[] {
  const set = new Set(activeMutatorIds);
  return MUTATOR_PARAGONS.filter((p) => p.requiredMutatorIds.every((id) => set.has(id)));
}
