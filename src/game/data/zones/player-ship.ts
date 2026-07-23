import type { ZoneDefinition } from "../../engine/world/zone-types";

/**
 * Player Ship — §18 "Nave del Jugador".
 *
 * The player's personal starship serves as a mobile hub with:
 * - Storage, Companion Hub, Crafting, Codex, Galaxy Map
 * - Upgradeable modules: Cargo Hold, Forge, Medbay, Stealth Module
 */

export interface ShipUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  /** Quest flag set when purchased. */
  flagKey: string;
  /** What it unlocks. */
  effect: string;
}

export const SHIP_UPGRADES: ShipUpgrade[] = [
  {
    id: "upgrade_cargo_hold",
    name: "Bodega de Carga Ampliada",
    description: "Duplica la capacidad de inventario para materiales y mercancías.",
    cost: 2000,
    flagKey: "ship_cargo_upgraded",
    effect: "inventory_capacity_double",
  },
  {
    id: "upgrade_forge",
    name: "Forja de a Bordo",
    description: "Instala una estación de fabricación en la nave. Fabrica objetos en cualquier parte.",
    cost: 5000,
    flagKey: "ship_forge_installed",
    effect: "crafting_anywhere",
  },
  {
    id: "upgrade_medbay",
    name: "Enfermería",
    description: "Instala una enfermería. Cura a todo el grupo entre zonas. Revive a los compañeros caídos.",
    cost: 3500,
    flagKey: "ship_medbay_installed",
    effect: "full_heal_on_ship",
  },
  {
    id: "upgrade_stealth",
    name: "Módulo de Sigilo",
    description: "Permite sortear ciertos bloqueos planetarios y evitar encuentros aleatorios durante los viajes.",
    cost: 8000,
    flagKey: "ship_stealth_installed",
    effect: "avoid_travel_encounters",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Ship Zones
// ═══════════════════════════════════════════════════════════════════════

export const SHIP_ZONES: ZoneDefinition[] = [
  {
    id: "player_ship_bridge",
    name: "Puente de la Nave",
    description: "La cabina de tu nave estelar. El mapa galáctico brilla en la consola principal.",
    planetId: "ship",
    sceneId: "ship_bridge",
    musicTrackId: "theme_main",
    hotspots: [
      { id: "hs_galaxy_map", label: "Mapa galáctico", position: [50, 30], type: "travel", icon: "ship" },
      { id: "hs_ship_quarters", label: "Camarotes de la Tripulación", position: [20, 55], type: "exit", targetZoneId: "player_ship_quarters", icon: "door" },
      { id: "hs_ship_hold", label: "Bodega de Carga", position: [80, 55], type: "exit", targetZoneId: "player_ship_hold", icon: "door" },
      { id: "hs_codex", label: "Terminal del Códice", position: [65, 35], type: "event", icon: "star" },
    ],
  },
  {
    id: "player_ship_quarters",
    name: "Camarotes de la Tripulación",
    description: "Literas y una zona común. Tus compañeros se reúnen aquí entre misiones.",
    planetId: "ship",
    sceneId: "ship_quarters",
    hotspots: [
      { id: "hs_quarters_exit", label: "Volver al puente", position: [50, 85], type: "exit", targetZoneId: "player_ship_bridge", icon: "door" },
      { id: "hs_companion_talk", label: "Hablar con un compañero", position: [40, 45], type: "event", icon: "person" },
      { id: "hs_meditation", label: "Rincón de meditación", position: [70, 40], type: "event", icon: "star" },
    ],
  },
  {
    id: "player_ship_hold",
    name: "Bodega de Carga",
    description: "Cajas de almacenaje, un banco de trabajo y el leve zumbido del hipermotor.",
    planetId: "ship",
    sceneId: "ship_hold",
    hotspots: [
      { id: "hs_hold_exit", label: "Volver al puente", position: [50, 85], type: "exit", targetZoneId: "player_ship_bridge", icon: "door" },
      { id: "hs_storage", label: "Almacén", position: [30, 45], type: "event", icon: "chest" },
      { id: "hs_workbench", label: "Banco de trabajo", position: [70, 40], type: "event", icon: "star", requireFlag: "ship_forge_installed" },
      { id: "hs_medbay", label: "Enfermería", position: [50, 30], type: "event", icon: "star", requireFlag: "ship_medbay_installed" },
    ],
  },
];
