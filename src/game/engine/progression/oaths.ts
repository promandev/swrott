/**
 * Oath system (Complementary Loop 3 / Idea CL3-C).
 *
 * Vows the player can swear at the Sacrifice Altar. Each oath grants a
 * powerful buff but breaks if a forbidden action is taken — breaking
 * imposes a long-lasting curse.
 *
 *   oath_silence          +30% force dmg; broken by speaking in dialogue
 *   oath_pacifism         +50% XP; broken by killing humanoids (boss kills OK)
 *   oath_no_flee          +40% credits; broken by fleeing combat
 *   oath_no_heal          +60% damage; broken by healing
 *   oath_one_weapon       +25% all stats; broken by switching weapon
 *   oath_naked            +100% XP; broken by equipping any armor
 *   oath_solo             +40% damage; broken by recruiting allies
 *
 * Curses last until 3 boss kills cleanse them or the player visits a
 * cleansing shrine (5,000 credits + 10 corruption to remove).
 */

export interface Oath {
  id: string;
  name: string;
  description: string;
  buffSummary: string;
  buffEffectId: string;
  breakConditionSummary: string;
  curseSummary: string;
  curseEffectId: string;
}

export const OATHS: Oath[] = [
  { id: "oath_silence",    name: "Juramento de Silencio",     description: "No hables, y la Fuerza gritará por ti.",
    buffSummary: "+30% Force damage.",             buffEffectId: "oath_silence_buff",
    breakConditionSummary: "Se activa con cualquier opción de diálogo no silenciosa.",
    curseSummary: "−20% a todo el daño durante 3 combates de jefe.", curseEffectId: "oath_silence_curse" },
  { id: "oath_pacifism",   name: "Juramento de Pacifismo",    description: "Manos limpias. Mente más clara.",
    buffSummary: "+50% XP gain.",                  buffEffectId: "oath_pacifism_buff",
    breakConditionSummary: "Mata a un humanoide que no sea jefe.",
    curseSummary: "−50% de XP obtenida durante 3 combates de jefe.", curseEffectId: "oath_pacifism_curse" },
  { id: "oath_no_flee",    name: "Juramento de No Retirada",  description: "Resiste, o muere.",
    buffSummary: "+40% credits dropped.",          buffEffectId: "oath_no_flee_buff",
    breakConditionSummary: "Huir de un combate.",
    curseSummary: "Los vendedores te rechazan durante 3 combates de jefe.", curseEffectId: "oath_no_flee_curse" },
  { id: "oath_no_heal",    name: "Juramento de Sufrimiento",   description: "El dolor es maestro.",
    buffSummary: "+60% damage.",                   buffEffectId: "oath_no_heal_buff",
    breakConditionSummary: "Curarte dentro o fuera del combate.",
    curseSummary: "Curación reducida un 50% durante 3 combates de jefe.", curseEffectId: "oath_no_heal_curse" },
  { id: "oath_one_weapon", name: "Juramento de la Hoja Única", description: "Un arma, una verdad.",
    buffSummary: "+25% all stats.",                buffEffectId: "oath_one_weapon_buff",
    breakConditionSummary: "Equipar un arma distinta.",
    curseSummary: "−25% a todos los atributos durante 3 combates de jefe.", curseEffectId: "oath_one_weapon_curse" },
  { id: "oath_naked",      name: "Juramento de la Carne",       description: "El cuerpo basta.",
    buffSummary: "+100% XP gain.",                 buffEffectId: "oath_naked_buff",
    breakConditionSummary: "Equipar cualquier pieza de pecho.",
    curseSummary: "−100% de XP durante 3 combates de jefe.", curseEffectId: "oath_naked_curse" },
  { id: "oath_solo",       name: "Juramento de Soledad",    description: "Solo, estoy completo.",
    buffSummary: "+40% damage.",                   buffEffectId: "oath_solo_buff",
    breakConditionSummary: "Invocar a un aliado o reclutar a un compañero.",
    curseSummary: "Los aliados se niegan a seguirte durante 3 combates de jefe.", curseEffectId: "oath_solo_curse" },
];

export function findOath(id: string): Oath | undefined {
  return OATHS.find((o) => o.id === id);
}
