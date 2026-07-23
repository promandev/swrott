/**
 * Achievements (Idea #23).
 *
 * Each achievement unlocks a Title that can be set via setActiveTitle.
 * Achievements are checked passively by `checkAchievements()` from the
 * combat-store on victory/kill events and from game-store on progression
 * milestones.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  titleReward: string;
  hidden?: boolean;
  /** Tier 1-3 — affects UI styling and rarity. */
  tier: 1 | 2 | 3;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Tier 1 — early game ─────────────────────────────────────────────
  { id: "first_blood",        name: "Primera Sangre",        description: "Derrota a tu primer enemigo.",                 titleReward: "Acólito",                 tier: 1 },
  { id: "level_5",            name: "Aprendiz",         description: "Alcanza el nivel 5.",                           titleReward: "Aprendiz",              tier: 1 },
  { id: "first_legendary",    name: "Atisbo de Poder",   description: "Encuentra tu primer objeto legendario.",          titleReward: "Cazatesoros",         tier: 1 },
  { id: "first_quest",        name: "Iniciado",           description: "Completa tu primera misión.",               titleReward: "Caminante de la Senda",              tier: 1 },
  { id: "korriban_cleared",   name: "Caminante entre Tumbas",    description: "Limpia todas las zonas de Korriban.",                titleReward: "Caminante de Tumbas",             tier: 1 },

  // ── Tier 2 — mid game ──────────────────────────────────────────────
  { id: "no_damage_win",      name: "Intacto",          description: "Gana un combate sin recibir daño.",           titleReward: "Intacto",               tier: 2 },
  { id: "ten_crits_one_fight",name: "Tormenta de Golpes",   description: "Asesta 10 golpes críticos en un solo combate.",titleReward: "Portador de Tormentas",            tier: 2 },
  { id: "use_all_chains",     name: "Coreógrafo",      description: "Activa cada cadena de habilidades al menos una vez.", titleReward: "Coreógrafo",           tier: 2 },
  { id: "ten_legendaries",    name: "Acaparador",            description: "Posee 10 objetos legendarios a la vez.",          titleReward: "El Acaparador",             tier: 2 },
  { id: "max_corruption",     name: "Tocado por el Vacío",       description: "Alcanza 100 de corrupción.",                    titleReward: "Hueco",                  tier: 2 },
  { id: "min_corruption",     name: "Caminante de la Luz",    description: "Alcanza 0 de corrupción tras haber estado por encima de 60.", titleReward: "Tocado por la Luz",           tier: 2 },
  { id: "level_25",           name: "Lord Sith",          description: "Alcanza el nivel 25.",                          titleReward: "Lord Sith",               tier: 2 },
  { id: "all_specs",          name: "Erudito",           description: "Desbloquea todas las especializaciones de tu clase.",titleReward: "Erudito",              tier: 2 },

  // ── Tier 3 — endgame ───────────────────────────────────────────────
  { id: "first_prestige",     name: "Renacido",             description: "Completa tu primer ciclo de prestigio.",      titleReward: "Renacido",                  tier: 3 },
  { id: "eternal_trial",      name: "Prueba Eterna",      description: "Completa la Prueba Eterna.",              titleReward: "El Eterno",             tier: 3 },
  { id: "ng_plus_5",          name: "Eco de Ecos",     description: "Alcanza NG+5.",                              titleReward: "Eco de Ecos",          tier: 3 },
  { id: "all_shards",         name: "Maestro del Saber",         description: "Reúne los 20 fragmentos de memoria.",            titleReward: "Voz del Pasado",       tier: 3 },
  { id: "all_achievements",   name: "Inevitable",         description: "Consigue todos los demás logros.",            titleReward: "Inevitable",              tier: 3, hidden: true },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
