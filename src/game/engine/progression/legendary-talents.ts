/**
 * Legendary talents (Complementary Loop 3 / Idea CL3-A).
 *
 * After fully completing a spec tree (all 9 nodes), one Legendary Talent
 * unlocks per spec. These are signature build-defining capstones.
 */

export interface LegendaryTalent {
  id: string;
  specId: string;
  name: string;
  description: string;
  effectId: string;
}

export const LEGENDARY_TALENTS: LegendaryTalent[] = [
  // Marauder / Carnage
  { id: "lt_carnage_oblivion", specId: "marauder_carnage",
    name: "El Filo del Olvido",
    description: "Los golpes críticos aplican un sangrado del 100% que ignora la armadura.",
    effectId: "lt_carnage_oblivion" },

  // Marauder / Annihilation (placeholder)
  { id: "lt_annihilation_eternal", specId: "marauder_annihilation",
    name: "Furia Eterna",
    description: "Por debajo del 25% de PV: daño recibido −50%, daño infligido +50%.",
    effectId: "lt_annihilation_eternal" },

  // Inquisitor / Madness
  { id: "lt_madness_devour", specId: "inquisitor_madness",
    name: "Devorar la Mente",
    description: "Matar a un enemigo atemorizado o aturdido reembolsa el 50% de los PF máximos.",
    effectId: "lt_madness_devour" },

  // Inquisitor / Lightning (placeholder)
  { id: "lt_lightning_thunderlord", specId: "inquisitor_lightning",
    name: "Señor del Trueno",
    description: "Tormenta de la Fuerza encadena a dos enemigos adicionales y aturde al objetivo original.",
    effectId: "lt_lightning_thunderlord" },

  // Assassin / Shadowblade
  { id: "lt_shadow_perfect_form", specId: "assassin_shadowblade",
    name: "Forma Perfecta",
    description: "Los críticos de Puñalada por la Espalda reinician todos los enfriamientos de habilidad.",
    effectId: "lt_shadow_perfect_form" },

  // Assassin / Phantom (placeholder)
  { id: "lt_phantom_undone", specId: "assassin_phantom",
    name: "Deshecho",
    description: "Una vez por combate: rebobina los últimos 3 turnos al morir.",
    effectId: "lt_phantom_undone" },
];

export function legendaryTalentFor(specId: string): LegendaryTalent | undefined {
  return LEGENDARY_TALENTS.find((t) => t.specId === specId);
}
