import type { Translations } from "./types";

export const en: Omit<Translations, "content"> = {
  meta: {
    title: "Star Wars: Rise of the Triumvirate",
    description:
      "A web CRPG set in the era of the Sith Triumvirate. Forge your path through power, treachery, or cunning.",
  },

  landing: {
    era: "Era of the Sith Triumvirate",
    riseOfThe: "Rise of the",
    triumvirate: "Triumvirate",
    tagline:
      "Begin as no one. Rise through power, treachery, or cunning. Hunt forbidden relics, command broken companions, and decide the galaxy's fate.",
    newGame: "New Game",
    continue: "Continue",
    replayIntro: "Replay Intro",
    options: "Options",
    credits: "Credits",
    version: "v0.1.0 · Foundation Build",
  },

  play: {
    awakening: "Awakening…",
    autosaved: "Autosaved",
  },

  cinematic: {
    cards: [
      {
        primary: "The Jedi are broken.",
        secondary: "The Republic lies in ash.",
      },
      {
        primary: "Three Sith Lords now divide the wreckage.",
        secondary: "They call themselves the Triumvirate.",
      },
      {
        primary: "Nihilus  ·  Traya  ·  Sion",
      },
      {
        primary: "Beneath the red sands of Korriban,",
        secondary: "a slave wakes with power in their blood.",
      },
      {
        primary: "Your chains end today.",
      },
    ],
    skip: "Skip ›",
    clickToAdvance: "Click to advance",
  },

  creation: {
    forgeYourDestiny: "Forge your destiny",
    newAcolyte: "New Acolyte",
    name: "Name",
    namePlaceholder: "e.g. Vethri Korr",
    ironman: "Ironman",
    ironmanDesc: "— single auto-saved slot, permadeath, no reloading.",
    selected: "Selected:",
    back: "Back",
    begin: "Begin",
    forging: "Forging…",
    classes: {
      marauder: {
        name: "Marauder",
        tagline: "Offensive Tank",
        blurb:
          "A wall of red rage. Cleaves armor, weathers blows, executes the wounded.",
        trees: ["Juggernaut", "Berserker", "Duelist"],
      },
      inquisitor: {
        name: "Inquisitor",
        tagline: "Caster · Control",
        blurb:
          "Bend minds, summon storms, drain the living. The galaxy listens — or screams.",
        trees: ["Sorcerer", "Corruptor", "Dominator"],
      },
      assassin: {
        name: "Assassin",
        tagline: "Burst · Stealth",
        blurb:
          "Vanish, reappear behind a throat. Mark, poison, hunt. Be the silence.",
        trees: ["Shadowblade", "Poisoner", "Specter"],
      },
    },
  },

  load: {
    title: "Load Game",
    close: "Close",
    ironman: "Ironman",
  },

  hud: {
    hp: "HP",
    force: "Force",
    korriban: "Korriban",
    academyExterior: "Academy Exterior",
    skillSlot: "Skill slot",
    character: "Character",
    inventory: "Inventory",
    journal: "Journal",
    map: "Map",
    menu: "Menu",
  },

  panels: {
    characterSheet: "Character Sheet",
    inventoryTitle: "Inventory",
    questJournal: "Quest Journal",
    galaxyMap: "Galaxy Map",
    gameMenu: "Game Menu",
    dialogue: "Dialogue",
    closeEsc: "Close (Esc)",
    underConstruction:
      "The {panel} panel is under construction.",
    underConstructionDesc:
      "It will arrive in a later phase of the build with full functionality (drag & drop equipment, talent trees, quest tracking, etc.).",
    saveGame: "Save Game",
    returnToTitle: "Return to Title",
    audio: "Audio",
    musicVolume: "Music Volume",
    sfxVolume: "SFX Volume",
    unmuteAll: "Unmute All",
    muteAll: "Mute All",
    gameSaved: "Game saved.",
    language: "Language",
  },
};
