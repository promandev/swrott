/**
 * Faction system — §8 "Facciones y Reputación".
 *
 * 5 factions with 6 reputation ranks and rewards per rank.
 */

export interface FactionDefinition {
  id: string;
  name: string;
  description: string;
  ranks: FactionRank[];
}

export interface FactionRank {
  name: string;
  minRep: number;
  rewards: FactionReward[];
}

export interface FactionReward {
  type: "item" | "skill" | "discount" | "access" | "title";
  value: string;
  description: string;
}

export const FACTION_RANKS = [
  { name: "Hostil", minRep: -100 },
  { name: "Poco amistoso", minRep: -50 },
  { name: "Neutral", minRep: 0 },
  { name: "Amistoso", minRep: 25 },
  { name: "Honrado", minRep: 50 },
  { name: "Exaltado", minRep: 100 },
] as const;

export const FACTIONS: FactionDefinition[] = [
  {
    id: "sith_empire",
    name: "Imperio Sith",
    description: "El poder sith renacido. Se respeta la fuerza; la debilidad es la muerte.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "sith_assassins_hunt", description: "Asesinos sith te dan caza." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "discount", value: "sith_vendor_10", description: "10% de descuento en los vendedores sith." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "item", value: "sith_lord_robes", description: "Túnicas de Lord Sith" }, { type: "access", value: "sith_inner_sanctum", description: "Acceso al sanctasanctórum de la Academia." }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "title", value: "Darth", description: "Título de Darth desbloqueado." }, { type: "skill", value: "force_dominate", description: "Desbloquea Dominar con la Fuerza." }] },
    ],
  },
  {
    id: "mandalorians",
    name: "Mandalorianos",
    description: "Guerreros ligados al honor. La fuerza en combate gana respeto.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "mando_bounty", description: "Hay una recompensa mandaloriana por tu cabeza." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "discount", value: "mando_vendor_10", description: "10% de descuento en el armero mandaloriano." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "item", value: "mandalorian_heavy_armor", description: "Armadura Pesada Mandaloriana" }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "title", value: "Mand'alor's Champion", description: "Campeón de Mandalore." }, { type: "item", value: "beskar_plating", description: "Placa de Beskar (única)." }] },
    ],
  },
  {
    id: "exchange",
    name: "El Intercambio",
    description: "El mayor sindicato criminal de la galaxia. Los créditos compran lealtad.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "exchange_hit", description: "Los cazarrecompensas del Intercambio te persiguen." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "discount", value: "black_market_10", description: "10% de descuento en el mercado negro." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "access", value: "smuggler_routes", description: "Acceso a las rutas rápidas de los contrabandistas." }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "title", value: "Crime Lord", description: "Título de Señor del Crimen." }, { type: "item", value: "exchange_signet", description: "Anillo de Sello del Intercambio (único)." }] },
    ],
  },
  {
    id: "jedi_remnant",
    name: "Remanente Jedi",
    description: "Supervivientes dispersos de la Orden Jedi. Vigilan desde las sombras.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "jedi_strike_team", description: "Equipos de asalto Jedi te dan caza." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "access", value: "jedi_archives", description: "Acceso a fragmentos del archivo Jedi." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "item", value: "jedi_meditation_crystal", description: "Cristal de Meditación Jedi." }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "skill", value: "force_redemption", description: "Desbloquea Redención de la Fuerza." }, { type: "title", value: "Redeemed", description: "Título de Redimido." }] },
    ],
  },
  {
    id: "czerka_corp",
    name: "Corporación Czerka",
    description: "Una megacorporación galáctica. Amoral, rentable y siempre contratando.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "czerka_blacklist", description: "Los mercenarios de Czerka atacan en cuanto te ven." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "discount", value: "czerka_vendor_15", description: "15% de descuento en las tiendas de Czerka." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "item", value: "czerka_prototype_blaster", description: "Bláster Prototipo de Czerka." }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "item", value: "czerka_executive_implant", description: "Implante Ejecutivo de Czerka (único)." }, { type: "title", value: "Executive Agent", description: "Título de Agente Ejecutivo." }] },
    ],
  },
  {
    id: "cult_of_nihilus",
    name: "Culto de Nihilus",
    description: "Fanáticos adoradores del Señor del Hambre. Buscan devorar la Fuerza misma.",
    ranks: [
      { name: "Hostil", minRep: -100, rewards: [{ type: "access", value: "nihilus_hunters", description: "Los asesinos del culto te persiguen sin tregua." }] },
      { name: "Poco amistoso", minRep: -50, rewards: [] },
      { name: "Neutral", minRep: 0, rewards: [] },
      { name: "Amistoso", minRep: 25, rewards: [{ type: "access", value: "cult_safe_houses", description: "Acceso a los refugios del culto por todos los planetas." }] },
      { name: "Honrado", minRep: 50, rewards: [{ type: "item", value: "nihilus_acolyte_mask", description: "Máscara de Acólito de Nihilus." }, { type: "skill", value: "force_drain_advanced", description: "Desbloquea Drenaje de la Fuerza (Avanzado)." }] },
      { name: "Exaltado", minRep: 100, rewards: [{ type: "title", value: "Voice of Hunger", description: "Título de Voz del Hambre." }, { type: "skill", value: "void_consumption", description: "Desbloquea Consunción del Vacío — drena Fuerza de todos los enemigos." }] },
    ],
  },
];

/** Get faction rank name for a given reputation value. */
export function getFactionRank(rep: number): string {
  const sorted = [...FACTION_RANKS].sort((a, b) => b.minRep - a.minRep);
  for (const rank of sorted) {
    if (rep >= rank.minRep) return rank.name;
  }
  return "Hostile";
}

/** Get all unlocked rewards for a faction at a given rep. */
export function getUnlockedRewards(faction: FactionDefinition, rep: number): FactionReward[] {
  return faction.ranks
    .filter((r) => rep >= r.minRep)
    .flatMap((r) => r.rewards);
}
